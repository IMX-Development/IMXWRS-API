var Sql = require('../db/sql.js');
const status = require('./status.controller');
const upload = require("../middlewares/upload");

const closeWaiver = async (req, res) => {
  try {
    await upload(req, res);
    // console.log('-------------------- REQ --------------------');
    // console.log(req);
    console.log('-------------------- NUMBER --------------------');
    const body = JSON.parse(JSON.stringify(req.body));
    console.log(body);
    console.log('-------------------- FILES --------------------');
    console.log(req.files);

    if (req.files.length <= 0) {
      return res.json({
        ok: false,
        message: 'You must select at least 1 file'
      });
    }
    return res.json({
      ok: true,
      message: 'Files has been uploaded.'
    });
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

module.exports = {
  closeWaiver: closeWaiver
};