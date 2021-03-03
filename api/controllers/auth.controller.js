const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.login = (req,res)=>{
    const user = {username: 'i.lopez'};
    const token = jwt.sign({user},process.env.TOKEN_SEED);
    return res.json({
        token
    });
}

function ensureToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
}