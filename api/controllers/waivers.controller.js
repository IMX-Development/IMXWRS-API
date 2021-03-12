var Sql = require('../db/sql.js');
var authorizations = require('../assets/authorizations/signed.authorizations');

exports.getData = (req,res)=>{
    let data = req.body;
    var query = `INSERT INTO requests() VALUES ? `;
    let promise = Sql.query(query,data);
    promise.then(result=>{
        res.json(result);
    },error =>{
        res.send(error);
    });
}

exports.createWaviver = (req,res) =>{
    
    let waiver = req.body.waiverRequest;
    let externalAuth = req.body.externalAuth || null;
    let expiration = req.body.expiration;

    let number = ''; 
    let date = new Date().getFullYear().toString().substring(2,4);
    
    // var query = "SELECT COUNT(*) AS newNumber FROM dbo.requests WHERE LEFT(number,1) = 'T'";
    let query = `SELECT COALESCE(MAX(SUBSTRING(number,6,4))+1,1) AS newNumber FROM dbo.requests WHERE LEFT(number,3) = 'TWR' AND SUBSTRING(number,4,2) = '${date}'`
    let promise = Sql.request(query);
    promise.then(result=>{
        let newNumber = result[0].newNumber.toString();
        newNumber = newNumber.padStart(4);
        newNumber = newNumber.replace(/ /g, '0');
        number = 'TWR' + 
            date + 
            newNumber;
        waiver.number = number;
        let query = "INSERT INTO requests() VALUES ? ";
        let promise = Sql.query(query,waiver);
        promise.then(result=>{
            let promises = [];
            for(let i=0; i<6; i++){
                let query, body;
                switch(i){
                    case 0:
                        query = "INSERT INTO actions() VALUES ?";
                        body = Sql.convertToArrayAddField(req.body.actions,number);
                        break;
                    case 1:
                        query = "INSERT INTO expiration() VALUES ?";
                        body = expiration;
                        body.request = number;
                        break;
                    case 2:
                        if(externalAuth == null){
                            continue;
                        }
                        query = "INSERT INTO externalAuthorization() VALUES ?";
                        body = externalAuth;
                        body.request = number;
                        break;
                    case 3:
                        query = "INSERT INTO parts() VALUES ?";
                        body = Sql.convertToArrayAddField(req.body.parts,number);
                        break;
                    case 4:
                        query = "INSERT INTO waivers() VALUES ?";
                        body =  Sql.convertToArrayAddField(req.body.deviations,number);
                        break;
                    case 5:
                        query = "INSERT INTO authorizations() VALUES ?";
                        body = Sql.convertToArrayAddField(req.body.managers,number);
                        break;
                }
                let promise = Sql.query(query,body);
                promises.push(promise);
                if(i == 5){
                    Promise.all(promises).then(result=>{
                        console.log('ok');
                        res.json({
                            ok: true,
                            id: number
                        });
                    },error=>{
                        console.log(error);
                        res.json({
                            ok: false,
                            message: error
                        });
                    });
                }
            }
        },error=>{
            res.json({
                ok : false,
                message : error
            });
        })
    },error =>{
        res.json({
            ok : false,
            message : error
        });
    });
}

exports.getAuthorizations = (req,res) =>{
    let type = req.query.number;
    let needsManager = req.query.needsManager;
    let auth = authorizations.getManagers(type,needsManager);
    let query = `SELECT name,username,position FROM users WHERE position in (${ auth.toString() })`;
    let promise = Sql.request(query);

    promise.then(result=>{
        res.json({
            ok : true,
            managers: result
        })
    },error=>{
        res.json({
            ok: false,
            message: error
        })
    });
}