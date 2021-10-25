/*  How to use
    Navigate to the path of this script
    i.e. > cd "C:\projects\Calibraciones-API"
    Use the following command:
    node service.js option
    Where option can be:
    install => Install and start the service
    stop => Stop the service
    start => Start the service
    uninstall => Stop and uninstall the service
    restart => Restart the service
    If no argument is passed then:
        If the service is installed, then it restarts
        If the service is not installed, it installs and starts it
    Any other argument will turn to default option
*/

const Service = require('node-windows').Service
const path = require('path');

const srv = new Service({
    name: 'IMXWRS-API',
    description: 'Service for IMXWRS API Service',
    script: path.join(__dirname, 'index.js'),
    env: {
        name: 'NODE_ENV',
        value: 'production'
    } //Props to i-saw-sparks
});

srv.on('install', () => {
    console.log('Service installed');
    srv.start();
});

srv.on('uninstall', () => {
    console.log('Service uninstalled');
    console.log('The service exists: ', srv.exists);
});

srv.on('error', () => {
    console.log('Error installing service');
});

srv.on('alreadyinstalled', () => {
    console.log('Service is installed');
});

srv.on('alreadyuninstalled', () => {
    console.log('Service is uninstalled');
});

srv.on('stop', () => {
    console.log('Service is stopped');
});

srv.on('start', () => {
    console.log('Service started');
});

const defaultFunction = () => {
    if(srv.exists){
        srv.restart();
    }else{
        srv.install()
    }
};

const opts = {
    'install': () => srv.install(),
    'stop': () => srv.stop(),
    'uninstall': () => srv.uninstall(),
    'start': () => srv.start(),
    'restart': () => srv.restart(),
    'default': () => defaultFunction()
};

try {
    const option = process.argv[2] || 'default'; //If no argument is passed
    const index = (opts.hasOwnProperty(option)) ? option : 'default'; //If argument doesn't exists
    console.log('Selected option: ' + index);
    const run = opts[index] || defaultFunction; //Just in case
    run();
}catch(e){
    console.log('Error: ');
    console.log(e);
}