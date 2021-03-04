const Auth = require('../controllers/auth.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/auth/login')
    .post(Auth.login)

    app.route('/auth/refresh')
    .post([token.verifyUser],Auth.refresh);
}