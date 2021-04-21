const newWaiver = require('../assets/email-templates/created-waiver');
const needsApproval = require('../assets/email-templates/needs-approval');
const hasActivity = require('../assets/email-templates/has-activity');
const waiverApproved = require('../assets/email-templates/waiver-approved')
const newActivity = require('../assets/email-templates/new-activity');
const newRemark = require('../assets/email-templates/new-remark');
const recoverPassword = require('../assets/email-templates/restore-password');
const pendingActivity = require('../assets/email-templates/pending-activity');

module.exports = {
    newWaiver : newWaiver.createdWaiver,
    needsApproval : needsApproval.needsApproval,
    hasActivity : hasActivity.hasActivity,
    waiverApproved : waiverApproved.waiverApproved,
    newActivity : newActivity.waiverApproved,
    newRemark : newRemark.newRemark,
    recoverPassword : recoverPassword.recoverPassword,
    pendingActivity : pendingActivity.weeklyReminder
}