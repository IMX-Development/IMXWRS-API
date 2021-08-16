var Users = require('../controllers/user.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/users')
    .post(Users.getUsers)
    .get(Users.getUsers);

    app.route('/user')
    .post(Users.addUser)

    app.route('/user/recover')
    .post(Users.recoverPassword)
    .put([token.verifyUser], Users.changePassword);

    app.route('/users/:user')
    .get([token.verifyUser], Users.getUser);
}