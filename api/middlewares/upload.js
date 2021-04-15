const util = require("util");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const body = JSON.parse(JSON.stringify(req.body));
    let folder = body.request;
    let path = `${__dirname}/../../upload/${folder}`;
    fs.mkdirSync(path, { recursive: true });
    callback(null, path);
  },
  filename: (req, file, callback) => {
    const body = JSON.parse(JSON.stringify(req.body));
    let id = body.request;
    var filename = `${file.originalname}-${id}-${Date.now()}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 10);

var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;