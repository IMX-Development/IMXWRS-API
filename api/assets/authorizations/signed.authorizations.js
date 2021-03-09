const signatures = [
    ["'employee'"],
    ["'employee'"],
    ["'employee'"],
    ["'employee'"]
]

const generalManager = {
    manager: "'developer'"
}

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
    return signs;
}