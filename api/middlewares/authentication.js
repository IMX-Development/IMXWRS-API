const jwt = require('jsonwebtoken');

let verifyUser = (req,res,next) =>{
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader != null && typeof bearerHeader != 'undefined'){
        const bearerHeader = bearerHeader.split(" ");
        const bearerToken = bearerHeader[1];
        req.token = bearerToken;
    }else{
        res.sendStatus(403);
    }
}

module.exports = {
    verifyUser
};