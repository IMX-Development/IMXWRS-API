var Waivers = require('../controllers/waivers.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/waivers')
    .get([token.verifyUser], Waivers.getData)
    .post([token.verifyUser], Waivers.createWaviver);

    app.route('/waivers/authorizations')
    .get(Waivers.getAuthorizations);

    app.route('/waivers/all')
    .get(Waivers.getWaivers);

    app.route('/waivers/remarks')
    .get([token.verifyUser], Waivers.getRemarked);
}