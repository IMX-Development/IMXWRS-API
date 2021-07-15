var Sql = require('../db/sql.js');

exports.getWaiverData = async(req, res) =>{ 
    try{
        let user = req.params.user;
        let type = req.params.type;

        let query;

        if(type == 'all'){
            query = `SELECT number, customer, status, type, typeNumber, area 
            FROM requests
            WHERE originator = '${ user }'
            ORDER BY creationDate DESC`
        }else{
            query = `SELECT number, customer, type, typeNumber, area 
            FROM requests
            WHERE originator = '${ user }'
            AND status = '${ type }'
            ORDER BY creationDate DESC`;
        }

        let data = await Sql.asyncRequest(query);

        console.log(data);

        return res.json({
            ok: true,
            data
        });
    }catch(e){
        console.log(e);
        return res.json({
            ok: false,
            message: e
        });
    }
}

exports.getData = (req, res) => {
    return res.json({
        ok: true,
        data: req.query
    });
}

exports.getWaiverStats = (req, res) =>{
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