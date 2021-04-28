const util = require("util");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let folder = req.params.waiver;
    let path = `${__dirname}/../../upload/${folder}`;
    fs.mkdirSync(path, { recursive: true });
    callback(null, path);
  },
  filename: (req, file, callback) => {
    let id = req.params.waiver;
    var filename = `${id}-${file.originalname}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 10);

var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;