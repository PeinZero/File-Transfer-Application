import {MongoClient} from 'mongodb'

const url = 'mongodb://localhost:27017';

var mongoclient = new MongoClient(url, {useUnifiedTopology: true});


export const connect = (callbackFunction) =>{
    mongoclient.connect((err,client) =>{
        var db = client.db('fileapp')
        return callbackFunction(err,db)
    })
    
}

