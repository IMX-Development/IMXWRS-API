const nodemailer = require('nodemailer')
require('dotenv').config();

let transporter = nodemailer.createTransport({
    service: "Outlook365",
    host: process.env.EMAIL_HOST, // Office 365 server
    port: process.env.EMAIL_PORT,     // secure SMTP
    secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

const sendEmail = (email, template, cb) => {

    console.log('Sending email to ' + email + ' about ' + template.subject);

    if(email.length > 0){
        transporter.sendMail({
            from: `IMXWRS <${ process.env.EMAIL_USER }>`, // sender address
            to: email,
            subject: template.subject,
            html: template.html,
        }, (error) => {
            if(error){
                console.log('error');
                console.log(error);
                cb(false);
            }else{
                console.log('Email sent');
                cb(true);
            }
        });
    }else{
        console.log('Emails avoided');
        cb(true);
    }

    // console.log('Email avoided');
    // cb(true);
}

module.exports = {
    sendEmail: sendEmail
}
