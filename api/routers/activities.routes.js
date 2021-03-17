const Activities = require('../controllers/activities.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/activities/unsigned')
    .get([token.verifyUser],Activities.getPendingActivities)
    .put([token.verifyUser],Activities.signActivity);

    app.route('/activities/pending')
    .get([token.verifyUser],Activities.getAssignedActivities)
    .put([token.verifyUser],Activities.markAsDone);
}