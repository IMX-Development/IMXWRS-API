var Sql = require('../db/sql.js');

exports.expireActions = async(req, res) => {
    try{
        let query = `UPDATE actions 
        SET signed = 'expired' 
        WHERE CAST(CURRENT_TIMESTAMP AS DATE) > date
        AND signed = 'pending'`;
    
        await Sql.asyncRequest(query);

        console.log('Task finished at ' + new Date().toString() + ' with status ' + true);

    }catch(e){
        console.log(e);
        console.log('Task finished at ' + new Date().toString() + ' with status ' + false);
    }
}