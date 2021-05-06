const pendingTasks = require('../tasks/pending.tasks');
const unfinishedWaivers = require('../tasks/unfinished.waivers');

module.exports = {
    pendingTasks : pendingTasks.sendPendingActivities,
    unfinishedWaivers : unfinishedWaivers.sendUnfinishedWaivers
}