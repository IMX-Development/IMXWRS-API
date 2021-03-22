const newWaiver = require('../assets/email-templates/created-waiver');
const needsApproval = require('../assets/email-templates/needs-approval');
const hasActivity = require('../assets/email-templates/has-activity');

module.exports = {
    newWaiver : newWaiver.createdWaiver,
    needsApproval : needsApproval.needsApproval,
    hasActivity : hasActivity.hasActivity
}