const signatures = [
    ["'developer'","'operations manager'"],
    ["'developer'", "'operations manager'"],
    ["'employee'"],
    ["'employee'"]
]

const generalManager = "'general manager'";

let addColumn = (field,value,arr) => {
    for(var elem of arr){
        elem[field] = value;
    }
    return arr;
}

exports.getRequiredManagers = (req,id) => {
    let signs = signatures[req.typeNumber - 1];
    if(req.requiresManager){
        signs.push(generalManager);
    }
    return addColumn('request',id,signs);
}

exports.getManagers = (type,needsManager) =>{
    let signs = signatures[type-1];
    if(needsManager){
        signs.push(generalManager);
    }
    console.log(signs);
    return signs;
}