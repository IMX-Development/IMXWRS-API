const Sql = require('../db/sql.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.login = (req,res)=>{
    let { username, password } = req.body;
    username = username.toString().replace(/'/g,"''");
    password = password.toString().replace(/'/g,"''");

    let query = `EXEC dbo.getUser @Username = '${ username }'`;
    let promise = Sql.request(query);

    promise.then(result=>{
        console.log(result);
        if(!result || result.length == 0){
            return res.json({
                ok: false,
                message: 'User not found. Please register in the system'
            });
        }
        let user = result[0];
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
                }
            })
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

exports.refresh = (req,res) =>{
    console.log(req.token);
    let aUser = jwt.verify(req.token, process.env.TOKEN_SEED);

    let query = `EXEC dbo.getUser @Username = '${ aUser['username'] }'`;
    let promise = Sql.request(query);

    promise.then(result =>{
        if(!result || result.length == 0){
            return res.json({
                ok: false,
                message: 'Cannot validate user. Please sign in again'
            });
        }
        const user = result[0];
        const token = jwt.sign({username: user.username}, process.env.TOKEN_SEED);
        return res.json({
            ok: true,
            token, 
            user : {
                username: user.username,
                position: user.position,
                name: user.name,
                email: user.email
            }
        });
    },error=>{
        return res.json({
            ok: false,
            message: error
        });
    });
}