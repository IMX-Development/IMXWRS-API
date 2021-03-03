const sql = require('mssql');

var config = {
    user: 'root',
    password: 'Interplex',
    server: 'localhost',
    database: 'ipxwrs',
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