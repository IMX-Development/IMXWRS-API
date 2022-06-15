const Auth = require('../controllers/auth.controller');
const token = require('./../middlewares/authentication');
const Domain = require('../middlewares/domain.auth')

module.exports = (app) => {

    app.route('/')
    .get( (req, res) => res.json({
        ok: true,
        message: "Server running!" ,
        date: new Date().toString(),
        EMAIL_ON: process.env.EMAIL_ON,
        DEBUG_MAIL: process.env.DEBUG_MAIL
    }));
    app.route('/auth/login')
.post([Domain.useCors, Domain.useSession],Auth.loginWithSSO)

    app.route('/auth/refresh')
    .post([token.verifyUser],Auth.refresh);
}