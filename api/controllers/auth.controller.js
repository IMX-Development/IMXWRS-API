const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../helpers/send-email');
const templates = require('../assets/email-templates/created-waiver');

require('dotenv').config();

exports.login = (req,res)=>{
    const { username, password } = req.body;
    let query = `SELECT * FROM users WHERE username = '${ username }' `;
    let promise = Sql.request(query);

    promise.then(result=>{
        if(!result || result.length == 0){
            return res.json({
                ok: false,
                message: 'User not found. Please register in the system'
            });
        }
        let user = result[0];
        if(user.password == password){
            let signValues = {
                username,
                name : user.name
            }
            const token = jwt.sign(signValues, process.env.TOKEN_SEED);

            /***
             * Tester
             */
            console.log("Trying to send email...");
            let template = templates.createdWaiver(user.name, 'TWR210040');
            sendEmail(
                'i.lopez@mx.interplex.com',
                template
            );
            return res.json({
                ok: true,
                token, 
                user : {
                    username: user.username,
                    position: user.position,
                    name: user.name,
                    email: user.email
                }
            })
        }else{
            return res.json({
                ok: false,
                message: 'Incorrect username or password'
            });
        }
    },error=>{
        return res.json({
            ok: false,
            message: error
        })
    });
}

exports.refresh = (req,res) =>{
    console.log(req.token);
    let aUser = jwt.verify(req.token, process.env.TOKEN_SEED);

    let query = `SELECT * FROM users WHERE username = '${ aUser['username'] }'`;
    let promise = Sql.request(query);

    promise.then(result =>{
        if(!result || result.length == 0){
            return res.json({
                ok: false,
                message: 'Cannot validate user. Please sign in again'
            });
        }
        const user = result[0];
        const token = jwt.sign({username: user.username}, process.env.TOKEN_SEED);
        return res.json({
            ok: true,
            token, 
            user : {
                username: user.username,
                position: user.position,
                name: user.name,
                email: user.email
            }
        });
    },error=>{
        return res.json({
            ok: false,
            message: error
        });
    });
}