var Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.getInfo = (req) =>{
    let token = jwt.verify(req.token, process.env.TOKEN_SEED);
    let username = token['username'];
    let query = `SELECT * FROM users WHERE username = '${ username }'`
    return Sql.request(query);
}