var Sql = require('../db/sql.js');

const { sendEmail } = require('../helpers/send-email');
const templates = require('../helpers/email-templates');

exports.sendPendingActivities = () => {
    return;
    //Need to change this query! Don't use it, it's obsolote
    let query = `SELECT DISTINCT users.email, users.name FROM 
    actions , requests, users  WHERE 
    actions.request = requests.number AND 
    users.username = actions.responsable AND (
    ( actions.signed = 'pending' AND DATEDIFF(d,requests.creationDate,GETDATE()) < 14 ) OR 
    ( actions.signed != 'done' AND DATEDIFF(d,actions.date,GETDATE()) >= 0 AND requests.status = 'open'))`;

    Sql.request(query).then(resp=>{

        let receivers = Sql.getPropertyAsArray(resp,'email');
        console.log([receivers, resp]);

        sendEmail(
            receivers,
            templates.pendingActivity(),
            (cb)=>{
                console.log('Task finished at ' + new Date().toString() + ' with status ' + cb);
            }
        );
    },error=>{
        console.log(error);
    });
}