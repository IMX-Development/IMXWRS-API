const signatures = [
    [
        'i.lopez',
        'osvaldo.lopez',
        'martha.rodriguez'
    ],
    [
        'i.lopez'
    ],
    [
        'osvaldo.lopez'
    ],
    [
        'Martha.Rodriguez'
    ],
]

const generalManager = 'Marco.Bueno'

exports.getRequiredManagers = (req) => {
    let signs = signatures[req.waiverRequest.typeNumber - 1];
    if(req.waiverRequest.requiresManager){
        signs.push(generalManager);
    }
    return signs; 
}