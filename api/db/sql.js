const sql = require('mssql');

require('dotenv').config();

var config = {
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    server: process.env.HOST,
    database: process.env.DATABASE,
    options: {
        instanceName: 'SQLEXPRESS'
    }
}

function query(query, data) {
    let req = getQuery(query,data);
    return request(req);
}

function request(query) {
    return new Promise((resolve, reject) => {
        new sql.ConnectionPool(config).connect().then(pool => {
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

let isString = (myVar) => {
    return typeof myVar === 'string' || myVar instanceof String;
}


/***
 * My own formatter ...
 */
function getQuery(query, data) {
    let columns = [];
    let rows = [];
    if (!Array.isArray(data)) {
        for (var key of Object.keys(data)) {
            columns.push(key);
            if (isString(data[key])) {
                rows.push("'" + data[key] + "'");
            }
            else {
                rows.push(data[key]);
            }
        }
        query = query.replace("()", "(" + columns.toString() + ")");
        query = query.replace("?", "(" + rows.toString() + ")");
        return query;
    } else {
        for (let [index, val] of data.entries()) {
            let row = [];
            for (let key of Object.keys(val)) {
                if (index === 0) {
                    columns.push(key);
                }
                if (isString(val[key])) {
                    row.push("'" + val[key] + "'");
                }
                else {
                    row.push(val[key]);
                }
            }
            rows.push(row);
        }
        let entries = [];
        for (let row of rows) {
            let entrie = "(" + row.toString() + ")";
            entries.push(entrie);
        }
        query = query.replace("()", "(" + columns.toString() + ")");
        query = query.replace("?", entries.toString());
        return query;
    }
}


module.exports = {
    query,
    request,
};