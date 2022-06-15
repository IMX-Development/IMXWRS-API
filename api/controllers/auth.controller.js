const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');
const { sso } = require('node-expose-sspi');
require('dotenv').config();

exports.loginWithSSO = async(req, res) => {
    try {
        const domain = sso.getDefaultDomain();
        credentials = { // : UserCredential 
            domain,
            user: req.body.username,
            password: req.body.password,
        };
        const ssoObject = await sso.connect(credentials);

        if (!ssoObject) {
            return res.json({
                ok: false,
                error: 'Invalid credentials'
            });
        }

        if (req.session) {
            req.session.sso = ssoObject;
        }

        const resp = await getToken(ssoObject);
        return res.json({
            ok: true,
            ...resp
        });

    } catch (e) {
        console.log("ERROR", e)
        if (e.message == 'Error: Usuario duplicado!') {
            console.log("res",e);
            return res.status(409).send({
                ok: false,
                error: "usuario duplicado"
            })
        } else {
            res.status(500).send({
                ok: false,
                error: e
            });
        }
    }
}

const getToken = async (sso) => {
    return new Promise(async (resolve, reject) => {
        try {
            const email = sso.user.adUser.mail[0]
            const user = {
                name: sso.user.name,
                domain: sso.user.domain,
                displayName: sso.user.displayName,
                email: email
            }

            if (user.domain != 'INTERPLEX') {
                console.log('Not in domain!');
                reject('Not in domain');
            }

            const respuesta = await getUser(user)
            return resolve({
                ...respuesta
            })

        } catch (error) {
            print("ERROR TOKEN", error)
            reject(new Error(error))
        }
    })
}

let getUser = async (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = `SELECT * FROM users WHERE email = '${user.email}'`
            let response = await Sql.request(query);

            if (response.length > 2) {
                reject(new Error("Usuario duplicado!"))
            }

            else if (!response || response.length == 0) { //Si no existe el usuario, lo creamos

                const body = [{
                    username: user.name,
                    name: user.displayName,
                    email: user.email,
                    position: 'user',
                    password: 'Interplex.1',
                }];

                query = 'INSERT INTO users() VALUES ?';
                
                await Sql.query(query, body);

                response = [body];
            }

            const bdUser = response[0];

            const awtInfo = {
                username: bdUser.username,
            };
            const token = jwt.sign(awtInfo, process.env.TOKEN_SEED);

            let roles = await Sql.asyncRequest(`SELECT DISTINCT position FROM users, backups
            WHERE backups.lender = users.username AND backups.granted = '${bdUser.username}'
            AND backups.enabled = 1`);
            

            resolve({
                token,
                user: {
                    username: bdUser.username,
                    position: bdUser.position,
                    name: bdUser.name,
                    email: bdUser.email,
                    roles: roles
                }
            });
        } catch (error) {
            console.log("ERROR EN USUARIO", error)
        }
    })
}

exports.login = async(req,res)=>{
    let { username, password } = req.body;
    username = username.toString().replace(/'/g,"''");
    password = password.toString().replace(/'/g,"'");

    let query = `EXEC dbo.getUser @Username = '${ username }'`;
    let promise = Sql.request(query);

    promise.then(async(result)=>{
        console.log(result);
        if(!result || result.length == 0){
            return res.json({
                ok: false,
                message: 'User not found. Please register in the system'
            });
        }
        let user = result[0];
        console.log([password, user.password]);
        
        let roles = await Sql.asyncRequest(`SELECT DISTINCT position FROM users, backups
        WHERE backups.lender = users.username AND backups.granted = '${username}'
        AND backups.enabled = 1`);

        if(user.password == password || user.temporal == password){
            let signValues = {
                username : user.username,
                // name : user.name
            }
            const token = jwt.sign(signValues, process.env.TOKEN_SEED);

            return res.json({
                ok: true,
                token, 
                user : {
                    username: user.username,
                    position: user.position,
                    name: user.name,
                    email: user.email,
                    recover : user.temporal == password
                },
                roles: roles.map(r => r.position)
            });
        }else{
            return res.json({
                ok: false,
                message: 'Incorrect username or password'
            });
        }
    },error=>{
        return res.json({
            ok: false,
            message: error
        })
    });
}

exports.refresh = async(req,res) =>{
    console.log(req.token);
    let aUser = jwt.verify(req.token, process.env.TOKEN_SEED);

    let query = `EXEC dbo.getUser @Username = '${ aUser['username'] }'`;
    let promise = Sql.request(query);

    promise.then(async(result) =>{
        if(!result || result.length == 0){
            return res.json({
                ok: false,
                message: 'Cannot validate user. Please sign in again'
            });
        }
        const user = result[0];
        const token = jwt.sign({username: user.username}, process.env.TOKEN_SEED);

        const roles = await Sql.asyncRequest(`SELECT DISTINCT position FROM users, backups
        WHERE backups.lender = users.username AND backups.granted = '${aUser['username']}'
        AND backups.enabled = 1`);

        return res.json({
            ok: true,
            token, 
            user : {
                username: user.username,
                position: user.position,
                name: user.name,
                email: user.email
            },
            roles: roles.map(r => r.position)
        });
    },error=>{
        return res.json({
            ok: false,
            message: error
        });
    });
}