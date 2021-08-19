const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');
const status = require('./status.controller');

require('dotenv').config();

function getUsername(req) {
    return jwt.verify(req.token, process.env.TOKEN_SEED)['username'];
}

exports.addRemark = (req,res)=>{
    let body = req.body;
    body['manager'] = getUsername(req);
    let promises = [];

    let query = `INSERT INTO remarks() VALUES ?`;
    promises.push(Sql.query(query, body));
    
    query = `UPDATE requests SET status = 'on hold' WHERE number = '${ body.request }'`;
    promises.push(Sql.request(query));

    Promise.all(promises).then(resp=>{
        
        status.sendRemark(req).then(resp=>{
            console.log(resp);
            res.json({
                ok: true
            });
        },error=>{
            console.log(error);
            res.json({
                ok: true,
                message: error
            });
        });
    },error=>{
        console.log(error);
        res.json({
            ok: false,
            message: error
        });
    });
}

exports.getApproved = (req, res) => {
    let user = getUsername(req);

    let query = `SELECT number, customer, status, creationDate 
                FROM  requests WHERE number in (
                    SELECT TOP 50 request FROM authorizations 
                    WHERE manager = '${user}' AND signed = 'signed' ORDER BY authorizations.date
                )`;

    let promise = Sql.request(query);

    promise.then(resp => {
        res.json({
            ok: true,
            authorizations: resp
        });
    }, error => {
        res.json({
            ok: false,
            mesage: error
        });
    });
}

exports.authorizeWaiver = (req, res) => {
    let user = getUsername(req);
    let waiver = req.body.waiver;
    let position = req.body.position;

    let query = `UPDATE authorizations 
    SET signed= 'signed', 
    date = CURRENT_TIMESTAMP,
    authorizator = '${user}'
    WHERE position = '${position}' 
    AND request = '${waiver}'`;

    let promise = Sql.request(query);

    promise.then(resp => {
        status.update(waiver,true).then(resp=>{
            res.json({
                ok: true
            });
        },error=>{
            res.json({
                ok: false,
                message: error
            });
        });
    }, error => {
        res.json({
            ok: false,
            message: error
        });
    });

}

exports.getAuthorizations = (req, res) => {
    let user = getUsername(req);

    let query = `SELECT requests.customer, users.name as originator, requests.creationDate, 
                requests.status,
               (SELECT COUNT(*) FROM actions WHERE 
                actions.request = requests.number AND actions.signed = 'pending') as pendingActivities,
                (SELECT COUNT(*) FROM actions WHERE 
                actions.request = requests.number) as totalActivities,
                authorizations.* FROM requests, authorizations, users 
                WHERE requests.number = authorizations.request AND 
                requests.originator = users.username AND  
                authorizations.manager = '${user}' AND authorizations.signed != 'signed'
                ORDER BY requests.creationDate DESC, pendingActivities ASC, requests.status DESC, requests.number ASC`;
    let promise = Sql.request(query);

    promise.then(resp => {
        res.json({
            ok: true,
            authorizations: resp
        });
    }, error => {
        res.json({
            ok: false,
            mesage: error
        });
    });
}