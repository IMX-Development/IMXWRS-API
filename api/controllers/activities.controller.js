const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.markAsDone = (req,res)=>{
    let id = req.body.id;
    let user = jwt.verify(req.token, process.env.TOKEN_SEED)['username'];

    let query = `UPDATE actions SET signed = 'done' WHERE id = '${ id }' AND responsable = '${ user }'`;
    console.log(query);

    let promise = Sql.request(query);
    promise.then(resp=>{
        res.json({
            ok: true 
        });
    },error=>{
        res.json({
            ok: false,
            message: error
        });
    });
}

exports.getAssignedActivities = (req,res)=>{
    let user = jwt.verify(req.token, process.env.TOKEN_SEED);
    let query = `SELECT requests.customer as customer, actions.* FROM 
                dbo.requests, dbo.actions WHERE requests.number = actions.request 
                AND actions.signed = 'signed' AND actions.responsable = '${user.username}' ORDER BY actions.date DESC`;

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

exports.getPendingActivities = (req,res)=>{
    let user = jwt.verify(req.token, process.env.TOKEN_SEED);
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

exports.signActivity = (req,res) =>{
    let user = jwt.verify(req.token, process.env.TOKEN_SEED);
    let waiver = req.body.waiver;
    let query = `UPDATE actions SET signed = 'signed' WHERE 
                 responsable = '${ user.username }' AND 
                 request = '${ waiver }'`;
    let promise = Sql.request(query);
    promise.then(resp=>{
        res.json({
            ok: true 
        });
    },error=>{
        res.json({
            ok: false,
            message: error
        });
    });
}