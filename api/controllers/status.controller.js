const Sql = require('../db/sql.js');

const { sendEmail, sendMailAysnc } = require('../helpers/send-email');
const templates = require('../helpers/email-templates');

const { getOriginator, getInfoWithToken } = require('../middlewares/user.identification')

exports.resendAuth = (id, authList) => {

    let promise = new Promise((resolve, reject) => {
        let promises = [];

        let query = `SELECT users.name as name FROM requests, users 
                WHERE number = '${id}' AND requests.originator = users.username`;
        promises.push(Sql.request(query));

        query = `SELECT DISTINCT users.email, users.name 
                FROM users, authorizations, backups 
                WHERE 
                (users.username = authorizations.manager
                OR (backups.lender = authorizations.manager AND backups.granted = users.username AND backups.enabled = 1))
                authorizations.request = '${ id }' AND authorizations.signed = 'pending'`;

        // if(authList != ''){
        //     query = query + ` AND authorizations.manager NOT IN ${ authList }`;
        // }

        promises.push(Sql.request(query));

        Promise.all(promises).then(resps => {
            console.log(resps);
            let originator = resps[0][0]['name'];
            let mailList = [];
            let receivers = [];

            resps[1].forEach(m => {
                mailList.push(m['email']);
                receivers.push(m['name']);
            });

            if(mailList.length > 0){
                sendEmail(
                    mailList,
                    templates.needsApproval(originator, id, receivers),
                    (cb => {
                        console.log('Done re sending authorizations with status ' + cb);
                        resolve(cb);
                    })
                );
            }else{
                resolve(true);
            }

        }, error => {
            console.log(error);
            reject('query');
        });
    });
    return promise;
}

exports.resendActivity = (id, actions) => {

    let promise = new Promise((resolve, reject) => {
        let promises = [];

        let query = `SELECT users.name as name FROM requests, users 
                WHERE number = '${id}' AND requests.originator = users.username`;
        promises.push(Sql.request(query));

        let noId = Sql.extractIdInList(actions,'id');
        query = `SELECT DISTINCT users.email, users.name FROM users, actions 
                WHERE users.username = actions.responsable AND 
                actions.request = '${ id }' AND actions.signed = 'pending'`;

        if(noId != ''){
            query = query + ` AND actions.id NOT IN ${ noId }`;
        }

        promises.push(Sql.request(query));

        Promise.all(promises).then(resps => {
            console.log(resps);
            let originator = resps[0][0]['name'];
            let mailList = [];
            let receivers = [];

            resps[1].forEach(m => {
                mailList.push(m['email']);
                receivers.push(m['name']);
            });

            if(mailList.length > 0){
                sendEmail(
                    mailList,
                    templates.hasActivity(originator, id, receivers),
                    (cb => {
                        console.log('Done re sending activities with status ' + cb);
                        resolve(cb);
                    })
                );
            }else{
                resolve(true);
            }

        }, error => {
            console.log(error);
            reject('query');
        });
    });
    return promise;
}

exports.sendRemark = (req) => {
    let promise = new Promise((resolve, reject) => {
        let promises = [];
        promises.push(getOriginator(req.body.request));
        promises.push(getInfoWithToken(req));
        Promise.all(promises).then(resp => {
            let receiver = resp[0][0];
            let managerName = resp[1][0]['name'];
            sendEmail(
                receiver.email,
                templates.newRemark(
                    receiver.name,
                    req.body.request,
                    managerName,
                    req.body.comment),
                cb => {
                    if (cb) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            )
        }, error => {
            reject(error);
        })
    });
    return promise;
}

exports.getEmailData = (id) => {
    let promises = [];
    let waiverData = `SELECT customer, users.name as originator, users.email as origEmail, creationDate, area, type, typeNumber
                        FROM requests, users WHERE requests.originator = users.username AND 
                        requests.number = '${id}'`;

    let waiverReceivers = `SELECT DISTINCT users.name, users.email FROM users, actions WHERE 
                            actions.responsable = users.username AND actions.request = '${id}'`;
    console.log(waiverData);
    console.log(waiverReceivers);
    promises.push(Sql.request(waiverData));
    promises.push(Sql.request(waiverReceivers));
    return promises;
}

exports.update = (id, isManager) => {
    let promise = new Promise((resolve, reject) => {
        checkStatus(id).then(resp => {
            if (!resp || resp.length == 0) {
                resolve(false);
            }
            let needed = resp[0];
            if (false && !isManager  && needed.actions == 0) {
                let promises = [];

                let query = `SELECT users.name as name FROM requests, users 
                             WHERE number = '${id}' AND requests.originator = users.username`;
                promises.push(Sql.request(query));

                query = `SELECT DISTINCT users.email, users.name FROM users, authorizations 
                        WHERE users.username = authorizations.manager AND 
                        authorizations.request = '${id}'`;

                promises.push(Sql.request(query));

                Promise.all(promises).then(resps => {
                    let originator = resps[0][0]['name'];
                    let mailList = [];
                    let receivers = [];

                    resps[1].forEach(m => {
                        mailList.push(m['email']);
                        receivers.push(m['name'])
                    });

                    sendEmail(
                        mailList,
                        templates.needsApproval(originator, id, receivers),
                        (cb => {
                            console.log('Done letting approve with status ' + cb);
                        })
                    );
                    resolve(true);

                });
            }
            else if (/*needed.actions == 0 &&*/ needed.auth == 0) {
                //Now we are talking
                let promises = [];
                promises.push(openWaiver(id));
                promises.push(getNextWaiver());

                Promise.all(promises).then(resps => {
                    let date = new Date().getFullYear().toString().substring(2, 4);
                    let newNumber = resps[1][0].newNumber.toString();
                    newNumber = newNumber.padStart(4);
                    newNumber = newNumber.replace(/ /g, '0');
                    let number = 'WR' +
                        date +
                        newNumber;
                    updateWaiver(id, number).then(_resp => {
                        //resolve(number);
                        Promise.all(this.getEmailData(number)).then(async(resp) => {
                            console.log('---------------- DEBUG -----------------');
                            console.log(resp);
                            let waiverData = resp[0][0];
                            let teamContact = resp[1];
                            let team = [];
                            let emailList = [];

                            teamContact.forEach(t => {
                                team.push(t.name);
                                emailList.push(t.email);
                            });

                            await sendMailAysnc(
                                waiverData['origEmail'],
                                templates.waiverApproved(
                                    waiverData['originator'],
                                    number,
                                    id,
                                    team,
                                    waiverData['customer'],
                                    waiverData['creationDate']
                                ));
                                //Comment on production !!!WARNING!!!
                                // emailList = ['diskman199@gmail.com', 'i.lopez@mx.interplex.com', 'lopezmurillo997@gmail.com'];
                                await sendMailAysnc(
                                    emailList,
                                    templates.newActivity(
                                        waiverData['originator'],
                                        number,
                                        id,
                                        team,
                                        waiverData['customer'],
                                        waiverData['creationDate'],
                                    ));

                            resolve(true);

                        }, error => {
                            console.log(error);
                            resolve(false);
                        })
                    }, error => {
                        console.log(error);
                        reject('Updating number failed');
                    })

                }, _error => {
                    reject('Could not get next number');
                });

            } else {
                resolve(false);
            }
        }, _error => {
            reject('Could not check status');
        })
    });
    return promise;
}

let checkStatus = (id) => {
    let query = `SELECT 
            (SELECT COUNT(*) FROM dbo.actions WHERE request = '${id}' AND signed = 'pending') as actions,
            (SELECT COUNT(*) FROM dbo.authorizations WHERE request = '${id}' AND signed = 'pending') as auth`;

    return Sql.request(query);
}

let openWaiver = (id) => {
    let query = `UPDATE requests SET status = 'open' WHERE number = '${id}'`;
    return Sql.request(query);
}

let getNextWaiver = () => {
    let date = new Date().getFullYear().toString().substring(2, 4);

    let query = `SELECT COALESCE(MAX(SUBSTRING(number,6,4))+1,1) AS newNumber FROM dbo.requests WHERE LEFT(number,2) = 'WR' AND SUBSTRING(number,3,2) = '${date}'`;
    return Sql.request(query);
}

let updateWaiver = (actualNumber, nextNumber) => {
    let query = `UPDATE requests SET 
                    number = '${nextNumber}' ,
                    oldNumber = '${actualNumber}'
                    WHERE number = '${actualNumber}'`;
    return Sql.request(query);
}

exports.closeWaiver = (id) => {
    //status = closed; CHANGED FOR TESTING !!!!!
    let query = `UPDATE requests SET status = 'closed' WHERE number = '${id}'`;
    return Sql.request(query);
}