const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');
const status = require('./status.controller');

require('dotenv').config();

exports.closeAction = async(req, res) =>{
    try{
        let id = req.params.id;
        let status = req.body.status || 'closed';

        let query = `UPDATE actions
        SET signed = CASE 
        WHEN (CAST(CURRENT_TIMESTAMP AS DATE) > date) 
            THEN 'closed late' 
            ELSE '${status}' END, 
        closed = CURRENT_TIMESTAMP
        WHERE id = '${id}'`;

        await Sql.asyncRequest(query);

        return res.json({
            ok: true
        });

    }catch(e){
        console.log(e);
        return res.json({
            ok: false,
            message: e
        });
    }
}

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
    let query = `SELECT requests.customer as customer, actions.*, requests.status as status FROM 
                dbo.requests, dbo.actions WHERE requests.number = actions.request 
                AND actions.signed = 'signed' AND actions.responsable = '${user.username}' ORDER BY actions.date ASC`;

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
    let query = `SELECT requests.customer as customer, actions.*, requests.status as status FROM 
                dbo.requests, dbo.actions WHERE requests.number = actions.request 
                AND actions.signed NOT LIKE '%closed%' AND actions.responsable = '${user.username}' ORDER BY actions.date ASC`;

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
        status.update(waiver,false).then(resp=>{
            res.json({
                ok: true,
            });
        },error=>{
            console.log(error);
            res.json({
                ok: false,
                message: error
            });
        });

    },error=>{
        res.json({
            ok: false,
            message: error
        });
    });
}