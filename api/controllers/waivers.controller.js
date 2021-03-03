var Sql = require('../db/sql.js');

exports.getData = (req,res)=>{
    var query = "SELECT * FROM users WHERE username = 'i.lopez'";
    let promise = Sql.request(query);
    promise.then(result=>{
        res.json(result);
    },error =>{
        res.send(error);
    });
}