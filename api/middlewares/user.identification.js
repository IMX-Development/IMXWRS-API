var Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.getInfoWithToken = (req) =>{
    let token = jwt.verify(req.token, process.env.TOKEN_SEED);
    let username = token['username'];
    let query = `SELECT username, name, email FROM users WHERE username = '${ username }'`;
    console.log(query);
    return Sql.request(query);
}

exports.getInfoWithField = (arr, field) =>{
    let users = [];
    console.log(arr);
    arr.forEach(a=>{
        users.push("'" + a[field] + "'");
    });
    let query = users.join(' OR username = ');
    let request = `SELECT username, name, email FROM users WHERE username = ${ query }`;
    console.log(request);
    return Sql.request(request);
}