const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.getAuthorizations = (req, res) => {
    let user = jwt.verify(req.token, process.env.TOKEN_SEED)['username'];

    let query = `SELECT requests.customer, users.name as originator, requests.creationDate, 
                authorizations.* FROM requests, authorizations, users 
                WHERE requests.number = authorizations.request AND 
                requests.originator = users.username AND  
                authorizations.manager = '${user}' `;
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