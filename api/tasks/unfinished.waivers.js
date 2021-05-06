var Sql = require('../db/sql.js');

const { sendEmail } = require('../helpers/send-email');
const templates = require('../helpers/email-templates');

exports.sendUnfinishedWaivers = () => {
    let query = `SELECT users.email, users.name,DATEDIFF(d,expiration.endDate,GETDATE()) as delay
    FROM users, requests, expiration
    WHERE users.username = requests.originator
    AND requests.number = expiration.request
    AND expiration.id = (SELECT MAX(id) FROM expiration WHERE expiration.request = requests.number)
    AND (
    (expiration.endDate IS NOT NULL AND DATEDIFF(d,expiration.endDate,GETDATE()) > 0));` 

    Sql.request(query).then(resp=>{

        let receivers = Sql.getPropertyAsArray(resp,'email');
        console.log([receivers, resp]);

        sendEmail(
            receivers,
            templates.unfinishedWaiver(),
            (cb)=>{
                console.log('Task finished at ' + new Date().toString() + ' with status ' + cb);
            }
        );
    },error=>{
        console.log(error);
    });
}