const Activities = require('../controllers/activities.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/activities/unsigned')
    .get([token.verifyUser],Activities.getPendingActivities);
}