const sql = require('mssql');

require('dotenv').config();

var config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.HOST,
    database: process.env.DATABASE,
    options: {
        instanceName: 'SQLEXPRESS'
    }
}

function request(query){
    return new Promise((resolve,reject)=>{
        
        new sql.ConnectionPool(config).connect().then(pool=>{
            return pool.request().query(query);
        }).then(result => {
            sql.close();
            resolve(result.recordset);
        }).catch(err => {
            sql.close();
            reject(err);
        });
    });
}

module.exports.request = request;