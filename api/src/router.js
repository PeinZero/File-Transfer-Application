import {version} from '../package.json'
import path from 'path'
import _ from 'lodash'
import File from './models/file'
import Post from './models/post'
import {ObjectID} from 'mongodb'
import Archiver from './archiver'
import Email from './email'

class AppRouter {
    constructor(app){
        this.app = app
        this.setupRouters()
    }

    setupRouters(){

        const app = this.app
        const db = app.get('db')
        const uploadDir = app.get('storageDir')
        const upload = app.get('upload')

        // root 
        app.get('/', (req, res, next) => {
            return res.status(200).json({
                version: version
            })
        })
        
        // File Uploading
        app.post('/api/upload', upload.array('files'), (req, res, next) => {
            const files = _.get(req, 'files', [])

            let fileModels = [];

            _.each(files, (fileObject) =>{
                const newFile = new File(app).initWithObject(fileObject).toJSON()

                fileModels.push(newFile)
            })

            if (fileModels.length){

                db.collection('files').insertMany(fileModels, (err,result) =>{
                    if (err){
                        return res.status(503).json({
                            error: {
                                message: "File/s Uploading failed!"
                            }
                        })
                    }

                    // console.log("File/s successfully uploaded", err, result)

                    // console.log("user request", req.body, result)

                    let post = new Post(app).initWithObject({
     
                        from: _.get(req, 'body.from'),
                        to: _.get(req, 'body.to'),
                        message: _.get(req, 'body.message'),
                        files: result.insertedIds,

                    }).toJSON()

                    //saving post to the database
                    db.collection('posts').insertOne(post, (err, result) =>{
                        if (err){
                            return res.status(503).json({
                                error: {
                                    message: "Post addition to database failed!"
                                }
                            })
                        }

                        // setting up email sending
                        const sendEmail = new Email(app)
                        sendEmail.emailDownloadLink(post, (error, info) => {
                            if (error) {
                                console.log("An error occured while emailing download link.")
                            }
                        })

                        return res.json(post)

                    })

                    // return res.json({
                    //     files: fileModels
                    // })
                })

            }
            else{
                return res.status(503).json({
                    error: {
                        message: "No File is added!"
                    }
                })
            }
        })

        // File Downloading
        app.get('/api/download/:id',  (req, res, next) => {

            const fileId = req.params.id;

            console.log( ObjectID(fileId))

            db.collection('files').find({_id: ObjectID(fileId)}).toArray( (err, result) =>{

                const fileName = _.get(result, '[0].name')
                
                if (err || !fileName){
                    return res.status(404).json({
                        error: {
                            message: "File not found!"
                        }
                    })
                }
                
                const filePath = path.join(uploadDir, fileName)

                return res.download(filePath,  _.get(result, '[0].originalname'), (err) => {
                    if (err) {
                        console.log(err)
                        // return res.status(404).json({
                        //     error: {
                        //         message: "File not found"
                        //     }
                        // })
                    }
                })
            
            }) 
    
        })

        // Post Details
        app.get('/api/posts/:id', (req, res, next) => {
            const postId = _.get(req, 'params.id')

            this.getPostById(postId, (err, result) => {
                if(err){
                    return res.status(404).json({error: {message: 'File not found.'}})
                }
                
                return res.json(result);
            })
               

        })

        // Downloading All Files
        app.get('/api/posts/:id/download', (req, res, next) => {

            const id = _.get(req, 'params.id', null)
            
            this.getPostById(id, (err, result) => {
                if(err){
                    return res.status(404).json({error: {message: 'File not found.'}})
                }
                
                const files = _.get(result, 'files', [])
                const archiver = new Archiver(app, files, res).download()
                
                return archiver
            })
        })
    }

    getPostById(id, callback = () => {}){

        let postObjectId = null
        const app = this.app;
        const db = app.get('db')
        
        try{
            postObjectId = new ObjectID(id)
        }
        catch (err){
            return callback(err, null)
        }

        db.collection('posts').find({_id: postObjectId}).limit(1).toArray( (err, results) => {
            let result = _.get(results, '[0]')

            if (err || !result){
                return callback(err ? err : new Error("File not found"))
            }
            const fileIds = _.get(result, 'files', [])
            let fileObjectIds = []

            _.each(fileIds, (fileId) =>{
                fileObjectIds.push(ObjectID(fileId))
            })

            db.collection('files').find({ _id: {$in: fileObjectIds} }).toArray( (err, files) => {
                if (err || !files || !files.length){
                    return callback(err ? err : new Error("File not found"))
                }
                result.files = files;

                return callback(null, result)
            })
           
        })
    }
}

export default  AppRouter;