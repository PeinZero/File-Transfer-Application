import _ from 'lodash';
import {url} from './config'

export default class Email {
    constructor(app){
        this.app = app
    }

    emailDownloadLink(post, callback = () => {}){

        const app = this.app
        const emailSender = app.emailSender
        const from = _.get(post, 'from')
        const to = _.get(post, 'to')
        const message = _.get(post, 'message')
        const postId = _.get(post, '_id')
        const downloadLink = `${url}/share/${postId}`

        // send mail with defined transport object
        let emailInfo = {
            from: from, // sender address
            to: to, // list of receivers
            subject: "[Rocket Share] Brought you your files !", 
            text: message, // plain text body
            html: `<p> ${message} </p> <p> Hey, ${from} has sent you some files. Click the link below to download the files. <br> <a href="${downloadLink}"> ${downloadLink} </a></p> 
            `,   
        }

        emailSender.sendMail(emailInfo, (error, info) =>{
            return callback(error, info)
        });
        

    }
}