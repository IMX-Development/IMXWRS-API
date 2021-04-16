const Files = require('../controllers/upload.controller');
const token = require('./../middlewares/authentication');

module.exports = (app) => {
    app.route('/files/:name')
    .get([token.verifyUser],Files.retrieveFile);
}