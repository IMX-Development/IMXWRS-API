const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');

exports.login = (req,res)=>{
    const user = {username: 'i.lopez'};
    const token = jwt.sign({user},'my_secret_token');
    return res.json({
        token
    });
}

function ensureToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
}