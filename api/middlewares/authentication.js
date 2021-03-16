let verifyUser = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader != null && typeof bearerHeader != 'undefined') {
        const headers = bearerHeader.split(" ");
        const bearerToken = headers[1];
        if (bearerToken != null && typeof bearerToken != 'undefined') {
            req.token = bearerToken;
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports = {
    verifyUser
};