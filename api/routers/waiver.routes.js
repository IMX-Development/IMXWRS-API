var Waiver = require('../controllers/waiver.controller');
const token = require('./../middlewares/authentication');
const Upload = require('./../controllers/upload.controller');

module.exports = (app) => {
    app.route('/waiver/:waiver')
    .get(Waiver.getWaiver)
    .post([token.verifyUser], Upload.closeWaiver)
    .put([token.verifyUser], Waiver.reopenWaiver);

    app.route('/waiver')
    .put([token.verifyUser],Waiver.modifyWaiver);

    app.route('/ia')
    .post(Waiver.getSimilar);
    
}