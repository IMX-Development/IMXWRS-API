exports.getData = (req,res)=>{
    var query = "SELECT * FROM users";
    let promise = Sql.request(query);
    promise.then(result=>{
        res.json(result);
    },error =>{
        res.send(error);
    });
}