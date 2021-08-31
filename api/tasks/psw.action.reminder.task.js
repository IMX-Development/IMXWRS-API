var Sql = require('../db/sql.js');

const { sendMailAysnc } = require('../helpers/send-email');
const templates = require('../helpers/email-templates');

exports.pswSendActionReminders = () => {
    let dates = [15, 10, 5, 0];

    dates.forEach(d => {
        let query = `SELECT DISTINCT users.email AS email FROM
        users, actions, requests
        WHERE users.username = actions.responsable
        AND actions.request = requests.number
        AND requests.status = 'open'
        AND actions.closed IS NULL
        AND requests.typeNumber = 5
        AND CAST(GETDATE() AS DATE) = 
        DATEADD(d, -${d}, actions.date)`;

        let resp = await Sql.asyncRequest(query);

        if(resp.length > 0){
            let receiverList = resp.map( r => r.email );

            await sendMailAysnc(
                receiverList,
                templates.pswReminder(d)
            );
        }
    });
}