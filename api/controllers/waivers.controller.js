var Sql = require('../db/sql.js');
var authorizations = require('../assets/authorizations/signed.authorizations');

const { sendEmail } = require('../helpers/send-email');
const { getInfoWithToken, getInfoWithField } = require('../middlewares/user.identification');

const templates = require('../assets/email-templates/created-waiver');

exports.getData = (req, res) => {
    let data = req.body;
    var query = `INSERT INTO requests() VALUES ? `;
    let promise = Sql.query(query, data);
    promise.then(result => {
        res.json(result);
    }, error => {
        res.send(error);
    });
}

exports.createWaviver = (req, res) => {

    let waiver = req.body.waiverRequest;
    let externalAuth = req.body.externalAuth || null;
    let expiration = req.body.expiration;

    let number = '';
    let date = new Date().getFullYear().toString().substring(2, 4);

    let query = `SELECT COALESCE(MAX(SUBSTRING(number,6,4))+1,1) AS newNumber FROM dbo.requests WHERE LEFT(number,3) = 'TWR' AND SUBSTRING(number,4,2) = '${date}'`
    let promise = Sql.request(query);

    promise.then(result => {

        let newNumber = result[0].newNumber.toString();
        newNumber = newNumber.padStart(4);
        newNumber = newNumber.replace(/ /g, '0');
        number = 'TWR' +
            date +
            newNumber;
        waiver.number = number;

        let query = "INSERT INTO requests() VALUES ? ";
        let promise = Sql.query(query, waiver);
        promise.then(result => {
            let promises = [];
            for (let i = 0; i < 6; i++) {
                let query, body;
                switch (i) {
                    case 0:
                        query = "INSERT INTO actions() VALUES ?";
                        body = Sql.convertToArrayAddField(req.body.actions, number);
                        break;
                    case 1:
                        query = "INSERT INTO expiration() VALUES ?";
                        body = expiration;
                        body.request = number;
                        break;
                    case 2:
                        if (externalAuth == null) {
                            continue;
                        }
                        query = "INSERT INTO externalAuthorization() VALUES ?";
                        body = externalAuth;
                        body.request = number;
                        break;
                    case 3:
                        query = "INSERT INTO parts() VALUES ?";
                        body = Sql.convertToArrayAddField(req.body.parts, number);
                        break;
                    case 4:
                        query = "INSERT INTO waivers() VALUES ?";
                        body = Sql.convertToArrayAddField(req.body.deviations, number);
                        break;
                    case 5:
                        query = "INSERT INTO authorizations() VALUES ?";
                        body = Sql.convertToArrayAddField(req.body.managers, number);
                        break;
                }
                let promise = Sql.query(query, body);
                promises.push(promise);
                if (i == 5) {
                    Promise.all(promises).then(result => {

                        let destinataryPromises = [];

                        destinataryPromises.push(getInfoWithToken(req));
                        destinataryPromises.push(getInfoWithField(Sql.convertToArray(req.body.actions), 'responsable'));
                        destinataryPromises.push(getInfoWithField(Sql.convertToArray(req.body.managers), 'manager'));

                        Promise.all(destinataryPromises).then(result => {
                            let originator = result[0][0];
                            let responsables = result[1];
                            let managers = result[2];

                            let approvalMailist = ['diskman199@gmail.com','i.lopez@mx.interplex.com'];
                            let actionsMailist = ['diskman199@gmail.com','i.lopez@mx.interplex.com','lopezmurillo997@gmail.com'];
                            
                            setTimeout(() => {
                                sendEmail(
                                    originator['email'],
                                    templates.createdWaiver(originator['name'], number)
                                );
                            }, 100 );

                            sendEmail(
                                actionsMailist,
                                templates.createdWaiver('colaborator', number)
                            );

                            managers.forEach(m => {
                                //approvalMailist.push(r['email']);
                            });
                            
                            responsables.forEach(r => {
                                //actionsMailist.push(r['email']);
                            });

                            sendEmail(
                                approvalMailist,
                                templates.createdWaiver('manager', number)
                            );


                        }, error => {
                            console.log('Promises failed');
                            console.log(error);
                        });

                        // getInfoWithToken(req).then(resp=>{
                        //     let data = resp[0];
                        //     sendEmail(
                        //         data['email'],
                        //         templates.createdWaiver(data['name'], number)
                        //     );
                        // },error=>{
                        //     console.log('Failed user data');
                        // });

                        res.json({
                            ok: true,
                            id: number
                        });
                    }, error => {
                        console.log(error);
                        res.json({
                            ok: false,
                            message: error
                        });
                    });
                }
            }
        }, error => {
            res.json({
                ok: false,
                message: error
            });
        })
    }, error => {
        res.json({
            ok: false,
            message: error
        });
    });
}

exports.getAuthorizations = (req, res) => {
    let type = req.query.number;
    let needsManager = req.query.needsManager;
    let auth = authorizations.getManagers(type, needsManager);
    let query = `SELECT name,username,position FROM users WHERE position in (${auth.toString()})`;
    let promise = Sql.request(query);

    promise.then(result => {
        res.json({
            ok: true,
            managers: result
        })
    }, error => {
        res.json({
            ok: false,
            message: error
        })
    });
}