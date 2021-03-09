var Waivers = require('../controllers/waiver.controller');

module.exports = (app) => {
    app.route('/waiver/:waiver')
    .get(Waivers.getWaiver)
}