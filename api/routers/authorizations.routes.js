const Authorization = require('../controllers/authorizations.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/authorizations')
    .get([token.verifyUser], Authorization.getAuthorizations);
}