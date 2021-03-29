const Sql = require('../db/sql.js');

const { sendEmail } = require('../helpers/send-email');
const templates = require('../helpers/email-templates');

exports.getEmailData = (id) => {
    let promises = [];
    let waiverData = `SELECT customer, users.name as originator, users.email as origEmail, creationDate, area, type, typeNumber
                        FROM requests, users WHERE requests.originator = users.username AND 
                        requests.number = '${id}'`;
    let waiverReceivers = `SELECT users.name, users.email FROM users, actions WHERE 
                            actions.responsable = users.username AND actions.request = '${id}'`;
    console.log(waiverData);
    console.log(waiverReceivers);
    promises.push(Sql.request(waiverData));
    promises.push(Sql.request(waiverReceivers));
    return promises;
}

exports.update = (id) => {
    let promise = new Promise((resolve, reject) => {
        checkStatus(id).then(resp => {
            if (!resp || resp.length == 0) {
                resolve(false);
            }
            let needed = resp[0];
            if (needed.actions == 0 && needed.auth == 0) {
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
                    updateWaiver(id, number).then(resp => {
                        //resolve(number);
                        Promise.all(this.getEmailData(number)).then(resp => {
                            let waiverData = resp[0][0];
                            let teamContact = resp[1];
                            let team = [];
                            let emailList = [];

                            teamContact.forEach(t => {
                                team.push(t.name);
                                emailList.push(t.email);
                            });

                            sendEmail(
                                waiverData['origEmail'],
                                templates.waiverApproved(
                                    waiverData['originator'],
                                    number,
                                    id,
                                    team,
                                    waiverData['customer'],
                                    waiverData['creationDate']
                                ),
                                (cb=>{
                                    //Comment on production !!!WARNING!!!
                                    emailList = ['diskman199@gmail.com', 'i.lopez@mx.interplex.com', 'lopezmurillo997@gmail.com'];
                                    sendEmail(
                                        actionsMailist,
                                        templates.newActivity(
                                            waiverData['originator'],
                                            number,
                                            id,
                                            team,
                                            waiverData['customer'],
                                            waiverData['creationDate'],
                                        ),
                                        cb=>{
                                            console.log('Done ' + cb);
                                        }
                                    );
                                })
                            );

                            resolve(true);

                        }, error => {
                            console.log(error);
                            resolve(false);
                        })
                    }, error => {
                        console.log(error);
                        reject('Updating number failed');
                    })

                }, error => {
                    reject('Could not get next number');
                });

            }else{
                resolve(false);
            }
        }, error => {
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

let closeWaiver = (id) => {
    let query = `UPDATE requests SET status = 'closed' WHERE number = '${id}'`;
    return Sql.request(query);
}