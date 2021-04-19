var Sql = require('../db/sql.js');
require('dotenv').config();

exports.recoverPassword = (req,res) => {
    let { username } = req.body;
    username = username.toString().replace(/'/g,"''");
    
    let number = getRandom();
    let query = `UPDATE users SET temporal = '${number}' WHERE username = '${username}'`;

    Sql.request(query).then(resp=>{
        console.log(error);
        res.json({
            ok : true
        });
    },error=>{
        console.log(error);
        res.json({
            ok : false,
            message : error
        });
    })
}

const getRandom = () =>{
    let length = process.env.PASS_LENGTH || 2;
    let maxRange = Math.pow(10,length); 
    let number = Math.floor(Math.random()*maxRange);
    number = number.toString();
    number = number.padStart(length);
    number = number.replace(/ /g, '0');
    let seed = process.env.PASS_SEED || "A"; 
    console.log(seed + number);
    return seed + number;

}

exports.getUsers = (req,res)=>{
    var query = "SELECT username,name FROM users "; //WHERE position = 'employee'";
    let promise = Sql.request(query);
    promise.then(result=>{
        res.json({
            status: true,
            users: result
        });
    },error =>{
        res.json(
            {
                status: false,
                message: error
            });
    });
}