var Users = require('../controllers/user.controller');

module.exports = (app) => {
    app.route('/users')
    .get(Users.getData);
}