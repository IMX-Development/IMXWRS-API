const util = require("util");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let folder = req.params.waiver;
    let path = `${__dirname}/../../upload/${folder}`;
    
    //Para guardado local específico
    //path = `C:/upload/${folder}`;

    //Para guardar en gdlwin03
    //path = `G:/INTERPLEX/Control de Documentos/11 Desviaciones Electronicas/uploads/${folder}`;
    
    fs.mkdirSync(path, { recursive: true });
    callback(null, path);
  },
  filename: (req, file, callback) => {
    let id = req.params.waiver;
    let unique = Number(new Date());
    var filename = `${id}_${unique}-${file.originalname}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 10);

var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;