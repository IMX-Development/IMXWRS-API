var Sql = require('../db/sql.js');
var authorizations = require('../assets/authorizations/signed.authorizations');

const { sendEmail, sendMailAysnc } = require('../helpers/send-email');
const { getInfoWithToken, getInfoWithField, getUser } = require('../middlewares/user.identification');

const templates = require('../helpers/email-templates');

exports.getData = (req, res) => {
    let username = getUser(req);
    let query = `SELECT number, customer, creationDate, status, typeNumber 
                FROM requests WHERE originator = '${ username }' ?
                ORDER BY creationDate DESC`;

    let filters = Sql.applyFilters(req.query);
    query = query.replace('?',filters);

    Sql.request(query).then(
        resp=>{
            res.json({
                ok: true,
                waivers: resp
            });
        },
        error=>{
            res.json({
                ok: false,
                message: error
            });
        }
    );
}

exports.createWaviver = (req, res) => {
    console.log(req.body);
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

                        Promise.all(destinataryPromises).then( async (result) => {
                            console.log(result);
                            let originator = result[0][0];
                            let responsables = result[1];
                            
                            let creator = originator['name'];
                            
                            let actionsMailist = [];
                            let team = [];

                            responsables.forEach(r => {
                                actionsMailist.push(r['email']);
                                team.push(r['name']);
                            });

                            await sendMailAysnc(
                                originator['email'],
                                templates.newWaiver(creator,number));

                            await sendMailAysnc(
                                actionsMailist,
                                templates.hasActivity(creator,number,team)
                            );

                            console.log('All emails sent');
                            
                            res.json({
                                ok: true,
                                id: number
                            });
                            

                            // sendEmail(
                            //     originator['email'],
                            //     templates.newWaiver(creator, number),
                            //     (cb) => {
                            //         console.log([actionsMailist, cb]);
                            //         console.log('XD');
                            //         sendEmail(
                            //             actionsMailist,
                            //             templates.hasActivity(creator, number),
                            //             (cb1) =>{
                            //                 console.log('All emails sent');
                            //                 res.json({
                            //                     ok: true,
                            //                     id: number
                            //                 });
                            //             }
                            //         );
                            //         console.log('umh');
                            //     }
                            // );

                        }, error => {
                            console.log('Promises failed');
                            console.log(error);
                            res.json({
                                ok: true,
                                id: number
                            });
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
    let customer = req.query.customer;
    let auth = authorizations.getManagers(type, needsManager, customer);
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

//Here we'll filter data later
exports.getWaivers = (req, res) => {
    let query = `SELECT number, customer, creationDate, users.name as name, status
    FROM requests, users
    WHERE users.username = requests.originator ?  
    ORDER BY creationDate DESC;`;

    let filters = Sql.applyFilters(req.query);
    query = query.replace('?',filters);

    console.log(query);
    Sql.request(query).then(
        resp=>{
            res.json({
                ok: true,
                waivers: resp,
            });
        },
        error=>{
            res.json({
                ok: false,
                waivers: resp
            });
        }
    );
}
    
exports.getRemarked = (req,res) => {
    let username = getUser(req);
    let query = `SELECT number, customer, creationDate, status 
                FROM requests WHERE originator = '${ username }' 
                AND status = 'on hold' ?
                ORDER BY creationDate DESC`;

    let filters = Sql.applyFilters(req.query);
    query = query.replace('?',filters);

    Sql.request(query).then(
        resp=>{
            res.json({
                ok: true,
                waivers: resp
            });
        },
        error=>{
            res.json({
                ok: false,
                message: error
            });
        }
    );
}