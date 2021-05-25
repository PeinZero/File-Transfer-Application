import http from 'http';
import path from 'path'
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer'
import nodemailer from "nodemailer"

import {connect} from "./database"
import AppRouter from "./router"
import {smtp} from './config'

let emailSender = nodemailer.createTransport(smtp);

// Uploading/Storing file config
const storageDir = path.join(__dirname, '..', 'storage')
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storageDir)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    }
  })
  
const upload = multer({ storage: storageConfig })

const app = express();
const server = http.createServer(app)
const PORT = 3000 || process.env.PORT;

app.use(morgan('dev'));

app.use(cors({
    exposedHeaders: "*"
}));

app.set('storageDir', storageDir)
app.set('upload', upload )
app.emailSender = emailSender;

// Connect to database
connect((err, db) => {
    if (err){
        console.log("An error occured while connecting to the database", err);
        throw(err);
    }

    app.set('db', db)

    // init Router
    new AppRouter(app)

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

export default app
// app.get('/', (req,res) =>{
//     res.send('Hello World!')
// })