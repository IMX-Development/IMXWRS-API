const Files = require('../controllers/upload.controller');
const token = require('./../middlewares/authentication');
const Upload = require('../controllers/upload.controller');

module.exports = (app) => {
    app.route('/files/:name')
    .get(Files.retrieveFile);

    app.route('/upload/:waiver')
    .post([token.verifyUser], Upload.uploadFile);
}