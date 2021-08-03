var Sql = require('../db/sql.js');
const status = require('./status.controller');
const upload = require("../middlewares/upload");
const path = require("path");
const Id = require('../middlewares/user.identification');
 
const closeWaiver = async (req, res) => {
  try {
    await upload(req, res);
    console.log('-------------------- NUMBER --------------------');
    console.log(req.params.waiver);
    console.log('-------------------- FILES --------------------');
    console.log(req.files);
    
    if (req.files.length <= 0) {
      return res.json({
        ok: false,
        message: 'You must select at least 1 file'
      });
    }

    let request = req.params.waiver;
    let promises = [];

    promises.push(status.closeWaiver(request));

    console.log('--------------- TEST AREA ---------------------');
    let author = Id.getUser(req);
    let description = req.body?.description || 'Resource file';

    let bodies = [];
    req.files.forEach(file=>{
      let body = {
        filename : file.filename,
        request : request,
        author: author,
        description : description
      };
      bodies.push(body);
    });
    
    let query = "INSERT INTO evidences() VALUES ?";
    promises.push(Sql.query(query,bodies));

    Promise.all(promises).then(resp=>{
      return res.json({
        ok: true,
        message: 'Files has been uploaded.'
      });
    },error=>{
      console.log(error);
      return res.json({
        ok: false,
        message: 'error'
      });
    })

  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.json({
        ok: false,
        message: 'Too many files to upload.'
      });
    }
    return res.json({
      ok: false,
      message: `Error when trying upload many files: ${error}`
    });
  }
};

const retrieveFile = async (req, res) => {
  let fileName = req.params.name;
  let folder = fileName.split('_')[0];
  const directoryPath = `upload/${folder}/`;
  const finalPath = path.resolve(directoryPath + fileName);

  console.log('path: ' + finalPath);

    res.sendFile(finalPath, (err) => {
      if (err) {
        console.log(err);
        res.json({
          ok : false,
          message: err
        });
      }
    });
}

module.exports = {
  closeWaiver: closeWaiver,
  retrieveFile : retrieveFile
};