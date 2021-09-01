const pendingTasks = require('../tasks/pending.tasks');
const unfinishedWaivers = require('../tasks/unfinished.waivers');
const expiredActions = require('../tasks/expire.task');
const pswActionExpired = require('../tasks/psw.action.expired.task.');
const pswActionReminder = require('../tasks/psw.action.reminder.task');
const pswFirstEscalation = require('../tasks/psw.first.scalation.task');
const pswWeeklyScalation = require('../tasks/psw.weekly.scalation.task');

module.exports = {
    pendingTasks : pendingTasks.sendPendingActivities,
    unfinishedWaivers : unfinishedWaivers.sendUnfinishedWaivers,
    expireActions : expiredActions.expireActions,
    pswActionExpired: pswActionExpired.pswSendActionReminders,
    pswActionReminders : pswActionReminder.pswSendActionReminders,
    pswFirstEscalation : pswFirstEscalation.pswSendActionReminders,
    pswWeeklyScalation : pswWeeklyScalation.pswSendActionReminders,
};