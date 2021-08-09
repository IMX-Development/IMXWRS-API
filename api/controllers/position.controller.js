const Sql = require('../db/sql.js');

exports.updateManagers = async(req, res) => {
    try{
        let body = req.body.managers;
        let calls = [];

        let query = `UPDATE users 
        SET position = 'employee'
        WHERE position LIKE '%manager%'`;

        await Sql.asyncRequest(query);

        body.forEach( m => {
            let query = `UPDATE users SET 
            position = '${m['position']}'
            WHERE username = '${m['username']}'`;

            calls.push(Sql.request(query));
        });

        return res.json({
            ok: true
        });
    }catch(e){
        console.log(e);
        return res.json({
            ok: false,
            message: e
        });
    }
}