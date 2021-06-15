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

const sendMailAysnc = async(email, template) => {
    console.log('Sending email to ' + email + ' about ' + template.subject);

    const sendEmail = process.env.EMAIL_ON == 'true';
    const debug = process.env.DEBUG_MAIL == 'true';

    if (debug) {
        console.log('Debug emailing is on!');
        email = 'i.lopez@mx.interplex.com'; //Just sent it to me 
        template.html = template.html.replace('&nbsp;','Este es un correo de prueba, por favor ignore su contenido');
    }

    return new Promise((resolve, reject) => {
        if (!sendEmail) {
            console.log('Server is not on production');
            return resolve(true);
        }

        if (email.length <= 0) {
            console.log('Error: VOID destinatary');
            return resolve(false);
        }

        transporter.sendMail({
            from: `IMXWRS <${process.env.EMAIL_USER}>`, // sender address
            to: email,
            subject: template.subject,
            html: template.html,
        }, (error, info) => {
            if (error) {
                console.log('Error sending email');
                console.log(error);
                return reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                return resolve(true);
            }
        });
    });
}


const sendEmail = (email, template, cb) => {

    console.log('Sending email to ' + email + ' about ' + template.subject);

    let sendEmail = process.env.EMAIL_ON == 'true';
    let debug = process.env.DEBUG_MAIL == 'true';

    if(sendEmail){
        if(debug){
            console.log('Debug emailing is on!');
            email = 'i.lopez@mx.interplex.com';
        }
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
            console.log('Error: VOID destinatary');
            cb(true);
        }
    }else{
        console.log('Server is not on production');
        cb(true);
    }
    
}

module.exports = {
    sendEmail: sendEmail,
    sendMailAysnc: sendMailAysnc
}
