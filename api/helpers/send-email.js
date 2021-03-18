const nodemailer = require('nodemailer')
require('dotenv').config();

const sendEmail = (email, template) => {
    console.log(process.env.EMAIL_USER);
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

    console.log('se creo el transport');
    console.log(transporter);
    transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: email,
        subject: template.subject,
        html: template.html,
    }, (error) => {
        console.log("LLEGO");
        console.log(error);
    });
}

module.exports = {
    sendEmail: sendEmail
}
