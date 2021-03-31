const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');
const status = require('./status.controller');
const users = require('../middlewares/user.identification');

require('dotenv').config();

function getUsername(req) {
    return jwt.verify(req.token, process.env.TOKEN_SEED)['username'];
}

exports.addRemark = (req,res)=>{
    let body = req.body;
    body['manager'] = getUsername(req);

    let query = `INSERT INTO remarks() VALUES ?`;
    let promise = Sql.query(query, body);

    promise.then(resp=>{
        users.getOriginator(req.body.request).then(resp=>{
            console.log(resp);
            resp.json({
                ok: true
            });
        },error=>{
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

    let query = `UPDATE authorizations SET signed= 'signed', date = CURRENT_TIMESTAMP 
                WHERE manager = '${user}' AND request = '${waiver}'`;

    let promise = Sql.request(query);

    promise.then(resp => {
        status.update(waiver).then(resp=>{
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
                authorizations.* FROM requests, authorizations, users 
                WHERE requests.number = authorizations.request AND 
                requests.originator = users.username AND  
                authorizations.manager = '${user}' AND authorizations.signed != 'signed'`;
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