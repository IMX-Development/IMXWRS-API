var Sql = require('../db/sql.js');

exports.getUsers = (req,res)=>{
    var query = "SELECT username,name FROM users "; //WHERE position = 'employee'";
    let promise = Sql.request(query);
    promise.then(result=>{
        res.json({
            status: true,
            users: result
        });
    },error =>{
        res.json(
            {
                status: false,
                message: error
            });
    });
}