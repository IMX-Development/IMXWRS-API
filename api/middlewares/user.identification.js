var Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.getUser = (req) =>{
    return jwt.verify(req.token, process.env.TOKEN_SEED)['username'];
}

exports.getOriginator = (number) => {
    let query = `SELECT username, name, email FROM users WHERE username = 
    (SELECT originator FROM requests WHERE number = '${number}')`;
    return Sql.request(query);
}

exports.getInfoWithToken = (req) =>{
    let token = jwt.verify(req.token, process.env.TOKEN_SEED);
    let username = token['username'];
    let query = `SELECT username, name, email FROM users WHERE username = '${ username }'`;
    return Sql.request(query);
}

exports.getInfoWithField = (arr, field) =>{
    let users = [];
    arr.forEach(a=>{
        users.push("'" + a[field] + "'");
    });
    let query = users.join(' OR username = ');
    let request = `SELECT username, name, email FROM users WHERE username = ${ query }`;
    return Sql.request(request);
}