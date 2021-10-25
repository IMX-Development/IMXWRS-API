const Auth = require('../controllers/auth.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/')
    .get( (req, res) => res.json({
        ok: true,
        message: "Server running!" ,
        date: new Date().toString() 
    }));
    app.route('/auth/login')
    .post(Auth.login)

    app.route('/auth/refresh')
    .post([token.verifyUser],Auth.refresh);
}