var Sql = require('../db/sql.js');
const status = require('./status.controller');
const ia = require('../helpers/ia.basic');

exports.reopenWaiver = (req, res) =>{
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let request = req.params.waiver;

    let queries = [];

    let query = `UPDATE requests SET status = 'open' WHERE 
                number = '${ request }'`;

    queries.push(Sql.request(query));

    query = `INSERT INTO expiration(startDate,endDate,request) VALUES 
    ('${startDate}','${endDate}','${request}')`;

    queries.push(Sql.request(query));
    
    Promise.all(queries).then(resp=>{
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

exports.getSimilar = (req, res) =>{
    
    ia.getSimilar(req.body).then(resp=>{
        res.json({
            ok : true,
            coincidences : resp
        });
    },error=>{
        res.json({
            ok : true, 
            message : error
        });
    });
}

exports.getWaiver = (req, res) => {
    let number = req.params.waiver;
    let body;
    let query = `SELECT requests.*,users.name as name FROM requests, users 
    WHERE (number = '${number}' OR oldNumber = '${number}') AND
    users.username = requests.originator`;
    let promise = Sql.request(query);
    promise.then((resp => {
        if (!resp || resp.length == 0) {
            res.json({
                ok: false,
                message: 'Error. Request not found'
            });
            return;
        }
        number = resp[0].number;
        let requests = (resp[0].type == 'external') ? 8 : 7;
        body = resp[0];
        let query;
        let promises = [];
        tables = ['parts', 'authorizations', 'expiration', 'waivers', 'actions', 'remarks','evidences', 'externalAuthorization'];
        for (let i = 0; i < requests; i++) {

            switch (i) {
                case 1:
                    query = `SELECT ${tables[i]}.*,users.name as name, users.position as title,
                    (SELECT name FROM users WHERE username = ${tables[i]}.authorizator) as authBy 
                    FROM ${tables[i]}, users 
                    WHERE request = '${number}' AND users.username = ${tables[i]}.manager`;
                    break;
                case 4:
                    query = `SELECT ${tables[i]}.*,users.name as name 
                    FROM ${tables[i]}, users 
                    WHERE request = '${number}' AND users.username = ${tables[i]}.responsable`;
                    break;
                case 5:
                    query = `SELECT ${tables[i]}.*, users.name as name 
                    FROM ${tables[i]}, users
                    WHERE request = '${number}' AND users.username = ${tables[i]}.manager`;
                    break;
                case 6:
                    query = `SELECT ${tables[i]}.*, users.name as name
                    FROM ${tables[i]}, users
                    WHERE request = '${number}' AND users.username = ${tables[i]}.author`;
                    break;
                default:
                    query = `SELECT * FROM ${tables[i]} WHERE request = '${number}'`;
                    break;
            }
            if(i==2){
                query = query + ' ORDER BY id DESC';
            }
            let promise = Sql.request(query);
            promises.push(promise);

            if (i == requests - 1) {
                Promise.all(promises).then(result => {
                    for (let i = 0; i < result.length; i++) {
                        body[tables[i]] = (i == 2 || i == 7) ? result[i][0] : result[i];
                    }
                    res.json({
                        ok: true,
                        waiver: body
                    });
                }, error => {
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

exports.modifyWaiver = (req, res) => {
    let promises = [];
    let body = req.body;
    let id = req.body.number;

    // console.log(req.body.newAuth);
    let keepAuth = `( ${req.body.keepAuth.map(k => `'${k}'`).toString()} )`;
    console.log(keepAuth);

    // return res.json({
    //     ok: false
    // });

    //Update body of waiver
    let query = "UPDATE requests SET () WHERE ? ";
    promises.push(Sql.update(query, body));

    //Update external Authorization
    query = `DELETE FROM externalAuthorization WHERE request = '${id}'`;
    promises.push(Sql.request(query));

    //Update auth 
    if(req.body.keepAuth.length == 0){
        query = `DELETE FROM authorizations WHERE request = '${id}'`;
        keepAuth = '';
    }else{
        query = `DELETE FROM authorizations WHERE request = '${id}' AND position NOT IN ${keepAuth}`;
    }
    promises.push(Sql.request(query));
    //Update required waivers (it's easier to delete everything and then add it again)
    query = `DELETE FROM waivers WHERE request = '${id}'`;
    promises.push(Sql.request(query));

    //Update expiration  (it's easier to delete everything and then add it again)
    query = `DELETE FROM expiration WHERE request = '${id}'`;
    promises.push(Sql.request(query));

    //Update parts  (it's easier to delete everything and then add it again)
    query = `DELETE FROM parts WHERE request = '${id}'`;
    promises.push(Sql.request(query));

    //Update actions
    body = Sql.extractIdInList(req.body.equalActions, 'id');
    if (body != '') {
        query = `DELETE FROM actions WHERE id NOT IN ${body} AND request = '${id}'`;
        promises.push(Sql.request(query));
    }else{
        query = `DELETE FROM actions WHERE request = '${id}'`;
        promises.push(Sql.request(query));
    }

    Promise.all(promises).then(resp => {
        console.log('Deletes done!');
        console.log(req.body);
        promises = [];

        if (req.body.type == 'external') {
            query = "INSERT INTO externalAuthorization() VALUES ?";
            body = req.body.externalAuthorization;
            body['request'] = id;
            promises.push(Sql.query(query, body));
        }

        query = "INSERT INTO expiration() VALUES ?";
        body = req.body.expiration;
        body.request = id;
        promises.push(Sql.query(query, body));

        query = "INSERT INTO waivers() VALUES ?";
        body = Sql.convertToArrayAddField(req.body.waivers, id);
        promises.push(Sql.query(query, body));

        query = "INSERT INTO parts() VALUES ?";
        body = Sql.convertToArrayAddField(req.body.parts, id);
        promises.push(Sql.query(query, body));

        if(req.body.newAuth != null && req.body.newAuth.length > 0){
            query = "INSERT INTO authorizations() VALUES ?";
            body = Sql.convertToArrayAddField(req.body.newAuth, id);
            promises.push(Sql.query(query, body));
        }

        if (req.body.newActions != null && req.body.newActions.length > 0) {
            query = "INSERT INTO actions() VALUES ?";
            body = Sql.convertToArrayAddField(req.body.newActions, id);
            promises.push(Sql.query(query, body));
        }

        //Update remarks
        query = `UPDATE requests SET revision = revision + 1 WHERE number = '${id}'`;

        promises.push(Sql.request(query));

        query = `UPDATE remarks 
        SET status = 'solved', 
        revision = ${req.body.revision} + 1,
        solved = CURRENT_TIMESTAMP
        WHERE request = '${id}'
        AND status != 'solved'`;

        promises.push(Sql.request(query));

        /***
         * Request reauth!!!!!
         */
        Promise.all(promises).then(async(resps) => {
            // let emailPromise = status.resendActivity(id, req.body.equalActions);
            // console.log('Resending activities...');
            // let authPromise = status.resendAuth(id, keepAuth);

            try{
                await status.resendActivity(id, req.body.equalActions);
                await status.resendAuth(id, keepAuth);
                res.json({
                    ok: true
                });
            }catch(e){
                console.log(e);
                res.json({
                    ok: true,
                    message: 'Cannot send emails'
                });
            }
        }, error => {
            console.log(error);
            res.json({
                ok: false,
                message: error
            });
        });
    }, error => {
        console.error(error);
        res.json({
            ok: false,
            message: error,
            level: 'critical'
        });
    });
}