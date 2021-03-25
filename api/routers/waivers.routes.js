var Waivers = require('../controllers/waivers.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/waivers')
    .get(Waivers.getData)
    .post([token.verifyUser],Waivers.createWaviver);

    app.route('/waivers/authorizations')
    .get(Waivers.getAuthorizations);

    app.route('/waivers/all')
    .get(Waivers.getWaivers);

}