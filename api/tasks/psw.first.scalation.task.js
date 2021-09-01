var Sql = require('../db/sql.js');

const { sendMailAysnc } = require('../helpers/send-email');
const templates = require('../helpers/email-templates');

exports.pswSendActionReminders = async() => {

    let manager = `SELECT email FROM users WHERE position = 'npi manager'`;
    manager = manager[0].email;

    let query = `SELECT users.email AS email,
        users.name as name, actions.id as id,
        actions.description as description, 
        actions.request as request, 
        actions.date as date
        FROM
        users, actions, requests
        WHERE users.username = actions.responsable
        AND actions.request = requests.number
        AND requests.status = 'open'
        AND actions.closed IS NULL
        AND requests.typeNumber = 5
        AND CAST(GETDATE() AS DATE) = 
        DATEADD(d, 5, actions.date)`;

    let resp = await Sql.asyncRequest(query);

    if (resp.length > 0) {
        let receiverList = resp.map(r => r.email);

        receiverList.push(manager);

        await sendMailAysnc(
            receiverList,
            templates.pswFirstEscalation(resp)
        );
    }
}