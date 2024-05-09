# Rocket Share

This project was created using MERN.

A file transfer that allow you to share messages and multimedia files via email. File are not uploaded on a cloud platform as of now. The Sent files can be download indivisually or all at once in .zip file. When the the file are being uploaded, a progress bar is displayed that shows the upload speed and remaining size of the file to be uploaded. Another information such total size of all files and number of files can also be seen.

## Usage
You need to create a config.js file in api/src/.
For example : api-->src-->config.js

Add these lines in config.js
```
export const smtp = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'Gmail email', // generated ethereal user
        pass: 'Gmail account password', // generated ethereal password
    },
}

export const url = 'http://localhost:3001'
```

## Instructions:
```
1) Add the files you need to share.
2) Enter receiver email and sender mail to send the files
3) The receiver will receive a mail with a download link. [CHECK SPAM!]
4) Click on the link to show the download page.
```

Future Additions
```
- Deploying the app
- Uploading Files to Cloud
- Dowloading Files to Cloud
- Implenting an enterprise way of sending mails.
```



