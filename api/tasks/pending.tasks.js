var Sql = require('../db/sql.js');

const { sendEmail } = require('../helpers/send-email');
const templates = require('../helpers/email-templates');

exports.sendPendingActivities = () => {
    console.log("Hello from scheduled task!");
}