const Sql = require('../db/sql.js');

exports.getBackups = async (req, res) => {
    try {
        let user = req.params.user;

        let query = `SELECT username, name, email, position 
        FROM users WHERE username = '${user}'`;

        let userInfo = await Sql.request(query);
        
        query = `SELECT username, name, email, position 
        FROM users, backups 
        WHERE lender = '${user}' 
        AND users.username = backups.granted`;

        let backups = await Sql.request(query);

        return res.json({
            ok: true,
            user: userInfo[0],
            backups: backups
        });

    } catch (e) {
        console.log(e);
        return res.json({
            ok: false,
            message: e
        });
    }
}

exports.updateManagers = async (req, res) => {
    try {
        let body = req.body.managers;
        let calls = [];

        let query = `UPDATE users 
        SET position = 'employee'
        WHERE position LIKE '%manager%'`;

        await Sql.asyncRequest(query);

        body.forEach(m => {
            let query = `UPDATE users SET 
            position = '${m['position']}'
            WHERE username = '${m['username']}'`;

            calls.push(Sql.request(query));
        });

        return res.json({
            ok: true
        });
    } catch (e) {
        console.log(e);
        return res.json({
            ok: false,
            message: e
        });
    }
}