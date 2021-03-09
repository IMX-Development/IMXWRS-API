var Sql = require('../db/sql.js');

exports.getWaiver = (req, res) => {
    let number = req.params.waiver;
    console.log('WR NUMBER: ' + number);
    let body;
    let query = `SELECT * FROM requests WHERE number = '${number}'`;
    let promise = Sql.request(query);
    promise.then((resp => {
        if (!resp || resp.length == 0) {
            res.json({
                ok: false,
                message: 'Error. Request not found'
            });
        }
        let requests = (resp[0].type == 'external') ? 6 : 5;
        body = resp[0];
        let query;
        tables = ['parts','authorizations','expiration','waivers','actions','externalAuthorization'];
        for (let i = 0; i < requests; i++) {

            query = `SELECT * FROM ${tables[i]} WHERE request = '${number}'`;

            let promise = Sql.request(query);
            promise.then(resp => {
                if (!resp || resp.length == 0) {
                    res.json({
                        ok: false,
                        message: 'Incomplete waiver'
                    });
                }
                if (i == 2 || i == 5) {
                    body[tables[i]] = resp[0];
                } else {
                    body[tables[i]] = resp;
                }
                console.log('Ok: ' + tables[i]);
                console.log(body[tables[i]])
                if(i == (requests-1)){
                    res.json({
                        ok: true,
                        waiver: body
                    });
                }
            }, error => {
                res.json({
                    ok: false,
                    message: error
                });
            })
        }
    }), error => {
        res.json({
            ok: false,
            message: error
        })
    });
}