require('dotenv').config();
const cron = require('node-cron');
const fs = require('fs');

var express = require('express'),
    app = express(),
    port = process.env.PORT || 33001,
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var userRoutes = require('./api/routers/user.routes');
var authRoutes = require('./api/routers/auth.routes');
var fileRoutes = require('./api/routers/files.routes');
var statsRoutes = require('./api/routers/stats.routes');
var waiverRoutes = require('./api/routers/waiver.routes');
var waiversRoutes = require('./api/routers/waivers.routes');
var positionRoutes = require('./api/routers/position.routes');
var activitiesRoutes = require('./api/routers/activities.routes');
var authorizationRoutes = require('./api/routers/authorizations.routes');

var scheduledTasks = require('./api/controllers/tasker.controller');

app.use((req, res, next) => {
    let ip = req.ip;
    ip = ip.substr(ip.lastIndexOf(':') + 1);
    console.table([{ Timestamp: new Date().toLocaleString(), Method: req.method, Request: req.originalUrl, Client: ip}]);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

userRoutes(app);
authRoutes(app);
fileRoutes(app);
statsRoutes(app);
waiverRoutes(app);
waiversRoutes(app);
positionRoutes(app);
activitiesRoutes(app);
authorizationRoutes(app);

console.clear();
scheduledTasks(cron);

app.listen(port,()=>{
    console.log(`Server running in port ${port} on ${process.env.NODE_ENV || 'development' } mode`);
    if (process.env.NODE_ENV == 'production') {
        fs.appendFile('daemon/calibracionesapi.restarts.log', 
        new Date() + ': Server restarted\n', (err) => {
            if(err){
                console.log("Couldn't update log");
            }
        });
    }
});