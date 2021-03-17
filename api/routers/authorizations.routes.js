const Authorization = require('../controllers/authorizations.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/authorizations')
    .get([token.verifyUser], Authorization.getAuthorizations)
    .put([token.verifyUser], Authorization.authorizeWaiver);

    app.route('/authorizations/approved')
    .get([token.verifyUser], Authorization.getApproved);
}