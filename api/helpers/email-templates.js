const newWaiver = require('../assets/email-templates/created-waiver');
const needsApproval = require('../assets/email-templates/needs-approval');
const hasActivity = require('../assets/email-templates/has-activity');
const waiverApproved = require('../assets/email-templates/waiver-approved')
const newActivity = require('../assets/email-templates/new-activity');
const newRemark = require('../assets/email-templates/new-remark');
const recoverPassword = require('../assets/email-templates/restore-password');
const pendingActivity = require('../assets/email-templates/pending-activity');
const unfinishedWaiver = require('../assets/email-templates/unfinished-waiver');
const pswReminder = require('../assets/email-templates/psw/action-reminder');
const pswEscalation = require('../assets/email-templates/psw/action-escalation');
const pswExpired = require('../assets/email-templates/psw/action-expired');
const pswFirstEscalation = require('../assets/email-templates/psw/first-escalation');

module.exports = {
    newWaiver : newWaiver.createdWaiver,
    needsApproval : needsApproval.needsApproval,
    hasActivity : hasActivity.hasActivity,
    waiverApproved : waiverApproved.waiverApproved,
    newActivity : newActivity.waiverApproved,
    newRemark : newRemark.newRemark,
    recoverPassword : recoverPassword.recoverPassword,
    pendingActivity : pendingActivity.weeklyReminder,
    unfinishedWaiver : unfinishedWaiver.weeklyReminder,
    pswReminder: pswReminder.actionReminder,
    pswEscalation: pswEscalation.actionReminder,
    pswExpired: pswExpired.actionReminder,
    pswFirstEscalation: pswFirstEscalation.actionReminder
};