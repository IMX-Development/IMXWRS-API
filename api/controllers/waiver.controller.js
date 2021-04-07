var Sql = require('../db/sql.js');
const status = require('./status.controller');

exports.getWaiver = (req, res) => {
    let number = req.params.waiver;
    let body;
    let query = `SELECT requests.*,users.name as name FROM requests, users 
    WHERE (number = '${ number }' OR oldNumber = '${ number }') AND
    users.username = requests.originator`;
    let promise = Sql.request(query);
    promise.then((resp => {
        if (! resp || resp.length == 0) {
            res.json({
                ok: false,
                message: 'Error. Request not found'
            });
            return;
        }
        number = resp[0].number;
        let requests = (resp[0].type == 'external') ? 7 : 6;
        body = resp[0];
        let query;
        let promises = [];
        tables = ['parts','authorizations','expiration','waivers','actions','remarks','externalAuthorization'];
        for (let i = 0; i < requests; i++) {

            switch(i){
                case 1:
                    query = `SELECT ${tables[i]}.*,users.name as name, users.position as title 
                    FROM ${tables[i]}, users 
                    WHERE request = '${number}' AND users.username = ${tables[i]}.manager`;
                    break;
                case 4:
                    query = `SELECT ${tables[i]}.*,users.name as name 
                    FROM ${tables[i]}, users 
                    WHERE request = '${ number}' AND users.username = ${tables[i]}.responsable`;  
                    break;
                case 5:
                    query = `SELECT ${tables[i]}.*, users.name as name 
                    FROM ${tables[i]}, users
                    WHERE request = '${ number }' AND users.username = ${tables[i]}.manager`;
                    break;
                default:
                    query = `SELECT * FROM ${tables[i]} WHERE request = '${number}'`;
                    break;
            }
            let promise = Sql.request(query);
            promises.push(promise);

            if( i == requests - 1){
                Promise.all(promises).then(result=>{
                    for(let i=0; i<result.length;i++){
                        body[tables[i]] = (i == 2 || i == 6) ? result[i][0] : result[i];
                    }
                    res.json({
                        ok: true,
                        waiver: body
                    });
                },error=>{
                    res.json({
                        ok: false,
                        message: error
                    });
                });
            }
        }
    }), error => {
        res.json({
            ok: false,
            message: error
        })
    });
}

exports.modifyWaiver = (req,res) => {
    let promises = [];
    let body = req.body;
    let id = req.body.number;

    //Update body of waiver
    let query = "UPDATE requests SET () WHERE ? ";
    promises.push(Sql.update(query,body));

    //Update external Authorization
    query = `DELETE FROM externalAuthorization WHERE request = '${ id }'`;
    promises.push(Sql.request(query));

    if(req.body.type == 'external'){
        query = "INSERT INTO externalAuthorization() VALUES ?";
        body = Sql.convertToArrayAddField(req.body.externalAuthoriation, id);
        promises.push(Sql.query(query,body));
    }

    //Update required waivers (it's easier to delete everything and then add it again)
    query = `DELETE FROM waivers WHERE request = '${ id }'`;
    promises.push(Sql.request(query));

    query = "INSERT INTO waivers() VALUES ?";
    body = Sql.convertToArrayAddField(req.body.waivers, id);
    promises.push(Sql.query(query,body));

    //Update expiration  (it's easier to delete everything and then add it again)
    query = `DELETE FROM expiration WHERE request = '${ id }'`;
    promises.push(Sql.request(query));
    
    query = "INSERT INTO expiration() VALUES ?";
    body = req.body.expiration;
    body.request = id;
    promises.push(Sql.query(query,body));

    //Update parts  (it's easier to delete everything and then add it again)
    query = `DELETE FROM parts WHERE request = '${ id }'`;
    promises.push(Sql.request(query));

    query = "INSERT INTO parts() VALUES ?";
    body = Sql.convertToArrayAddField(req.body.parts, id);
    promises.push(Sql.query(query,body));

    //Update auth 
    query = `DELETE FROM authorizations WHERE request = '${ id }'`;
    promises.push(Sql.request(query));

    query = "INSERT INTO authorizations() VALUES ?";
    body = Sql.convertToArrayAddField(req.body.authorizations, id);
    promises.push(Sql.query(query,body));

    //Update actions
    body = Sql.extractIdInList(req.body.equalActions,'id');
    query = `DELETE FROM actions WHERE id NOT IN ${ body }`;
    promises.push(Sql.request(query));

    if(req.body.newActions?.length > 0){
        query = "INSERT INTO actions() VALUES ?";
        body = Sql.convertToArrayAddField(req.body.newActions, id);
        promises.push(Sql.query(query,body));  
    }
    
    //Update remarks
    query = `UPDATE remarks SET status = 'solved' WHERE request = '${ id }'`;
    promises.push(Sql.request(query));

    Promise.all(promises).then(resps=>{
        let emailPromise = status.resendActivity(id);
        console.log('promising...')
        console.log(emailPromise);
        emailPromise.then(resp=>{
            res.json({
                ok: true 
            });
        },error=>{
            res.json({
                ok: true,
                message : 'Cannot send emails'
            });
        });

    },error=>{
        console.log(error);
        res.json({
            ok: false,
            message : error
        });
    });
}