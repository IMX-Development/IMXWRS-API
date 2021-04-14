var Waiver = require('../controllers/waiver.controller');
const token = require('./../middlewares/authentication');
const Upload = require('./../controllers/upload.controller');

module.exports = (app) => {
    app.route('/waiver/:waiver')
    .get(Waiver.getWaiver)
    .post([token.verifyUser], Upload.closeWaiver);

    app.route('/waiver')
    .put([token.verifyUser],Waiver.modifyWaiver);

    app.route('/waiver/ia')
    .post(Waiver.getSimilar);
    
}