var Sql = require('../db/sql.js');

exports.getAuthorizationsData = async(req, res) =>{
    try{
        let user = req.params.user;
        let type = req.params.type;
        let all = user == 'all' ? '1' : '0';

        let query;

        if(type == 'all'){
            query = `SELECT authorizations.date, authorizations.request, requests.customer 
            AS customer, requests.status AS waiverSatus, users.position as position, authorizations.signed as status
            FROM requests, authorizations, users
            WHERE (manager = '${ user }'
            OR 1 = ${all})
            AND requests.number = authorizations.request
            AND users.username = authorizations.manager
            ORDER BY date DESC`;
        }else{
            query = `SELECT authorizations.date, authorizations.request, requests.customer 
            AS customer, requests.status AS waiverSatus, users.position as position
            FROM requests, authorizations, users
            WHERE (manager = '${ user }'
            OR 1 = ${all})
            AND authorizations.signed = '${ type }'
            AND requests.number = authorizations.request
            AND users.username = authorizations.manager
            ORDER BY date DESC`;
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

exports.getActionData = async(req, res) =>{
    try{
        let user = req.params.user;
        let type = req.params.type;
        let all = user == 'all' ? '1' : '0';

        let query;

        if(type == 'all'){
            query = `SELECT description, actions.date, actions.request, requests.customer 
            AS customer, requests.status AS waiverSatus, actions.signed as status
            FROM requests, actions
            WHERE (responsable = '${ user }'
            OR 1 = ${all})
            AND requests.number = actions.request
            ORDER BY date DESC`;
        }else{
            query = `SELECT description, actions.date, actions.request, requests.customer 
            AS customer, requests.status AS waiverSatus
            FROM requests, actions
            WHERE (responsable = '${ user }'
            OR 1 = ${all})
            AND actions.signed = '${ type }'
            AND requests.number = actions.request
            ORDER BY date DESC`;
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

exports.getRemarksData = async(req, res) =>{
    try{
        let user = req.params.user;
        let type = req.params.type;
        let all = user == 'all' ? '1' : '0';

        let query;

        if(type == 'all'){
            query = `SELECT comment, remarks.date, requests.type, remarks.request, requests.customer 
            AS customer, requests.status AS waiverSatus, remarks.status as status 
            FROM requests, remarks
            WHERE (manager = '${ user }'
            OR 1 = ${all})
            remarks.status = '${ type }'
            AND requests.number = remarks.request
            ORDER BY date DESC`;
        }else{
            query = `SELECT comment, remarks.date, requests.type, remarks.request, requests.customer 
            AS customer, requests.status AS waiverSatus 
            FROM requests, remarks
            WHERE (manager = '${ user }'
            OR 1 = ${all})
            AND remarks.status = '${ type }'
            AND requests.number = remarks.request
            ORDER BY date DESC`;
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

exports.getWaiverData = async(req, res) =>{ 
    try{
        let user = req.params.user;
        let type = req.params.type;
        let all = user == 'all' ? '1' : '0';

        let query;

        if(type == 'all'){
            query = `SELECT number, customer, status, type, typeNumber, area 
            FROM requests
            WHERE (originator = '${ user }'
            OR 1 = ${all})
            AND (0 = ${all} OR status!='closed')
            ORDER BY creationDate DESC`
        }else{
            query = `SELECT number, customer, type, typeNumber, area 
            FROM requests
            WHERE (originator = '${ user }'
            OR 1 = ${all})
            AND status = '${ type }'
            AND (0 = ${all} OR status !='closed')
            ORDER BY creationDate DESC`;
        }

        let data = await Sql.asyncRequest(query);

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