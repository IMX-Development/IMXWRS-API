var Sql = require('../db/sql.js');

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
    console.log(req.body);
    
    let waiver = req.body.waiverRequest;
    let externalAuth = req.body.externalAuth || null;
    let expiration = req.body.expiration;

    let number = '';

    var query = "SELECT COUNT(*) AS newNumber FROM dbo.requests WHERE LEFT(number,1) = 'T'";
    let promise = Sql.request(query);
    promise.then(result=>{
        console.log('result=>',result);
        let newNumber = result[0].newNumber.toString();
        newNumber = newNumber.padStart(4);
        newNumber = newNumber.replace(/ /g, '0');
        console.log(newNumber);
        number = 'T'+ 
            new Date().getFullYear().toString().substring(2,4)+
            newNumber;
        waiver.number = number;
        console.log(number);
        console.log(waiver);
        let query = "INSERT INTO requests() VALUES ? ";
        let promise = Sql.query(query,waiver);
        promise.then(result=>{
            for(let i=0; i<5; i++){
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
                }
                let promise = Sql.query(query,body);
                promise.then(result=>{
                    if(i==4){
                        res.json({
                            ok:true
                        })
                    }
                    console.log(result);
                },error=>{
                    res.json({
                        ok : false,
                        message : error
                    });
                });
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