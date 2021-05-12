var Sql = require('../db/sql.js');

exports.getWaiverStats = (req,res) =>{
    let filter = req.params.filter;
    
    filter = Sql.avoidInjection(filter);

    let query = `SELECT TOP 10
                COUNT(${filter}) as data, 
                ${filter} as label
                FROM dbo.requests 
                GROUP BY ${filter}
                ORDER BY data DESC`;

    Sql.request(query).then(resp=>{
        res.json({
            ok : true,
            title : filter,
            stats : resp
        });
    },error=>{
        res.json({
            ok : false,
            message : error
        });
    });
}