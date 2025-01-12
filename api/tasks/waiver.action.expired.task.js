var Sql = require('../db/sql.js');

const { sendMailAysnc } = require('../helpers/send-email');
const templates = require('../helpers/email-templates');

exports.waiverSendActionReminders = async() => {

    let query = `SELECT DISTINCT users.email AS email FROM
        users, actions, requests
        WHERE users.username = actions.responsable
        AND actions.request = requests.number
        AND requests.status = 'open'
        AND actions.closed IS NULL
        AND requests.typeNumber != 5
        AND CAST(GETDATE() AS DATE) = 
        DATEADD(d, 1, actions.date)`;

    // query = `SELECT 'i.lopez@mx.interplex.com' as email`;

    let resp = await Sql.asyncRequest(query);

    if (resp.length > 0) {
        let receiverList = resp.map(r => r.email);

        await sendMailAysnc(
            receiverList,
            templates.waiverExpired()
        );
    }
}