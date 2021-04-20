var Sql = require('../db/sql.js');
require('dotenv').config();
const { sendEmail } = require('../helpers/send-email');
const templates = require('../helpers/email-templates');
var identification = require('../middlewares/user.identification');

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
    let query = `UPDATE users SET temporal = '${number}' WHERE username = '${username}'`;
    promises.push(Sql.request(query));

    query = `SELECT name, email FROM users WHERE username = '${username}'`;
    promises.push(Sql.request(query));

    Promise.all(promises).then(resp => {
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
    var query = "SELECT username,name FROM users "; //WHERE position = 'employee'";
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