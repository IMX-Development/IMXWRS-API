const { sso } = require('node-expose-sspi'),
    cors = require('cors'),
    session = require('cookie-session');

const useCors = cors((req, callback) => {
    const options = {
        credentials: true,
        origin: req.headers.origin
    };
    callback(null, options);
});

const useSession = session({
    secret: process.env.TOKEN_SEED,
    resave: false,
    saveUninitialized: true
});

const verifyWindowsUser =  sso.auth({
                                useSession: false,
                                useGroups: false,
                                forceNTLM: true,
                                allowsAnonymousLogon: true,
                                allowsGuest: true
                            });

const handleWindowsErrors = (err, req, res, next) => {
    if (err) {
        console.log(err);
    }
    next();
}

module.exports = {
    handleWindowsErrors,
    verifyWindowsUser,
    useSession,
    useCors
}