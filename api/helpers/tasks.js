const pendingTasks = require('../tasks/pending.tasks');
const unfinishedWaivers = require('../tasks/unfinished.waivers');
const expiredActions = require('../tasks/expire.task');
const pswActionExpired = require('../tasks/psw.action.expired.task.');
const pswActionReminder = require('../tasks/psw.action.reminder.task');
const pswFirstEscalation = require('../tasks/psw.first.scalation.task');
const pswWeeklyScalation = require('../tasks/psw.weekly.scalation.task');
const waiverActionExpired = require('../tasks/waiver.action.expired.task');
const waiverActionReminder = require('../tasks/waiver.action.reminder.task');
const waiverFirstEscalation = require('../tasks/waiver.first.scalation.task');
const waiverWeeklyScalation = require('../tasks/waiver.weekly.scalation.task');

module.exports = {
    pendingTasks : pendingTasks.sendPendingActivities,
    unfinishedWaivers : unfinishedWaivers.sendUnfinishedWaivers,
    expireActions : expiredActions.expireActions,
    pswActionExpired: pswActionExpired.pswSendActionReminders,
    pswActionReminders : pswActionReminder.pswSendActionReminders,
    pswFirstEscalation : pswFirstEscalation.pswSendActionReminders,
    pswWeeklyScalation : pswWeeklyScalation.pswSendActionReminders,
    waiverActionExpired: waiverActionExpired.waiverSendActionReminders,
    waiverActionReminders : waiverActionReminder.waiverSendActionReminders,
    waiverFirstEscalation : waiverFirstEscalation.waiverSendActionReminders,
    waiverWeeklyScalation : waiverWeeklyScalation.waiverSendActionReminders,
};