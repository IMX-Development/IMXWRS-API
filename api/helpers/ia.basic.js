const Sql = require('../db/sql.js');

exports.getSimilar = (body) =>{
    let type = body.type;
    let customer = body.customer;
    let intPieces = Sql.extractIdInList(body.parts,'interplexPN');
    let extPieces = Sql.extractIdInList(body.parts, 'customerPN');

    let query = `SELECT DISTINCT requests.number, requests.creationDate, requests.customer, 
                requests.status, users.name as originator
                FROM requests, users, parts
                WHERE requests.originator = users.username AND 
                parts.request = requests.number AND 
                (parts.customerPN IN ${ extPieces }) OR (parts.interplexPN IN ${ intPieces }) AND
                requests.type = '${ type }' AND 
                requests.customer = '${ customer }' AND
                creationDate >= DATEADD(MONTH, -3, GETDATE())`;
    
    return Sql.request(query);
}