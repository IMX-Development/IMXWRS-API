const signatures = [
    ["'developer'","'operations manager'", "'quality manager'","'engineering manager'"],
    ["'developer'", "'operations manager'", "'quality manager'"],
    ["'developer'","'finances manager'","'operations manager'", "'quality manager'","'engineering manager'"],
    ["'developer'","'finances manager'","'general manager'","'operations manager'", "'quality manager'","'engineering manager'"]
];

const specialCustomers = [
    "continental"
];

const generalManager = "'general manager'";

let addColumn = (field,value,arr) => {
    for(var elem of arr){
        elem[field] = value;
    }
    return arr;
}

exports.getRequiredManagers = (req,id) => {
    let signs = signatures[req.typeNumber - 1];
    if(req.requiresManager || specialCustomers.includes(req.customer.toLowerCase())){
        signs.push(generalManager);
    }
    return addColumn('request',id,signs);
}

exports.getManagers = (type,needsManager,customer='') =>{
    let signs = signatures[type-1];
    if(needsManager, specialCustomers.includes(customer.toLowerCase())){
        signs.push(generalManager);
    }
    console.log(signs);
    //Testing purposes
    return ["'developer'"];
    return signs;
}