const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.getPendingActivities = (req,res)=>{
    console.log(req.token);
    let user = jwt.verify(req.token, process.env.TOKEN_SEED);
    console.log(user);
    let query = `SELECT requests.customer as customer, actions.* FROM 
                dbo.requests, dbo.actions WHERE requests.number = actions.request 
                AND actions.signed = 'pending' AND actions.responsable = '${user.username}' ORDER BY actions.date DESC`;

    let promise = Sql.request(query);

    promise.then(resp=>{
        res.json({
            ok: true,
            actions: resp
        });
    },error=>{
        res.json({
            ok: false,
            mesage: error
        });
    });
}