var Sql = require('../db/sql.js');
require('dotenv').config();
const { sendEmail } = require('../helpers/send-email');
const templates = require('../helpers/email-templates');
var identification = require('../middlewares/user.identification');

exports.getUser = (req,res) => {
    let promises = [];
    console.log(req.params.user);

    let user = req.params.user;
    user = Sql.avoidInjection(user);

    let query = `SELECT username, name, email, position FROM users WHERE username = '${ user }'`;
    promises.push(Sql.request(query));

    query = `SELECT COUNT(status) as data, status as label 
                 FROM dbo.requests 
                 WHERE originator = '${ user }' 
                 GROUP BY status`;
    promises.push(Sql.request(query));

    query = `SELECT COUNT(signed) as data, signed as label 
                FROM dbo.actions 
                WHERE responsable = '${ user }' 
                GROUP BY signed`;
    promises.push(Sql.request(query));

    query = `SELECT COUNT(signed) as data, signed as label 
            FROM dbo.authorizations 
            WHERE manager = '${ user }' 
            GROUP BY signed`;
    promises.push(Sql.request(query));

    query = `SELECT COUNT(status) as data, status as label 
            FROM dbo.remarks 
            WHERE manager = '${ user }' 
            GROUP BY status`;
    promises.push(Sql.request(query));

    Promise.all(promises).then(resps=>{
        res.json({
            ok : true,
            user : resps[0][0],
            stats : {
                waivers : resps[1],
                actions : resps[2],
                authorizations : resps[3],
                remarks  : resps[4]
            }
        });
    },error=>{
        res.json({
            ok : false,
            message : error
        });
    })
    
}

exports.changePassword = (req,res) => {
    const user = identification.getUser(req);
    let newPassword = req.body.password;
    newPassword = newPassword.toString().replace(/'/g, "''");

    let query = `UPDATE users SET password = '${ newPassword }' WHERE username = '${ user }'`;

    Sql.request(query).then(resp=>{
        res.json({
            ok : true,
        });
    },error=>{
        res.json({
            ok : false,
            message : error
        });
    });
}

exports.recoverPassword = (req, res) => {
    let username = req.body.username;
    console.log(req.body);
    username = username.toString().replace(/'/g, "''");

    let promises = [];

    let number = getRandom();
    let query = `UPDATE users SET temporal = '${number}' WHERE username = '${username}' 
    OR email = '${username}'`;
    promises.push(Sql.request(query));

    query = `SELECT name, email FROM users WHERE username = '${username}' 
    OR email = '${username}'`;
    promises.push(Sql.request(query));

    Promise.all(promises).then(resp => {
                
        if(resp[1].length != 0){
            let user = resp[1][0];
            sendEmail(
                user.email,
                templates.recoverPassword(
                    user.name,
                    number
                ),
                cb => {
                    res.json({
                        ok : cb
                    });
                }
            )
        }else{
            res.json({
                ok: false,
                message: 'User not found'
            })
        }

        
    }, error => {
        console.log(error);
        res.json({
            ok: false,
            message: error
        });
    });
}

const getRandom = () => {
    let length = process.env.PASS_LENGTH || 2;
    let maxRange = Math.pow(10, length);
    let number = Math.floor(Math.random() * maxRange);
    number = number.toString();
    number = number.padStart(length);
    number = number.replace(/ /g, '0');
    let seed = process.env.PASS_SEED || "A";
    console.log(seed + number);
    return seed + number;

}

exports.getUsers = (req, res) => {
    var query = "SELECT username,name,position FROM users "; //WHERE position = 'employee'";
    let promise = Sql.request(query);
    promise.then(result => {
        res.json({
            status: true,
            users: result
        });
    }, error => {
        res.json(
            {
                status: false,
                message: error
            });
    });
}