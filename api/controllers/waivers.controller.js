var Sql = require('../db/sql.js');

exports.getData = (req,res)=>{
    var query = `INSERT INTO users() VALUES ? `;
    let promise = Sql.query(query,data);
    promise.then(result=>{
        res.json(result);
    },error =>{
        res.send(error);
    });
}