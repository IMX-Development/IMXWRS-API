var Auth = require('../controllers/auth.controller');

module.exports = (app) => {
    app.route('/auth/login')
    .post(Auth.login)
    .get(Auth.login);
}