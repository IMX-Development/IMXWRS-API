var Waiver = require('../controllers/waiver.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/waiver/:waiver')
    .get(Waiver.getWaiver);

    app.route('/waiver')
    .put([token.verifyUser],Waiver.modifyWaiver);

    app.route('/waiver/ia')
    .post(Waiver.getSimilar);
    
}