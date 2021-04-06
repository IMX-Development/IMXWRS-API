var Sql = require('../db/sql.js');

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
    
    let query = "UPDATE requests SET () WHERE ? ";
    promises.push(Sql.update(query,body));

    Promise.all(promises).then(resps=>{
        res.json({
            ok: true,
            message: resps 
        });
    },error=>{
        res.json({
            ok: false,
            message : error
        });
    });
}