const newWaiver = require('../assets/email-templates/created-waiver');
const needsApproval = require('../assets/email-templates/needs-approval');

module.exports = {
    newWaiver : newWaiver.createdWaiver,
    needsApproval : needsApproval.needsApproval
}