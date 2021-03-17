require('dotenv').config();

var express = require('express'),
    app = express(),
    port = process.env.PORT || 33001,
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var userRoutes = require('./api/routers/user.routes');
var authRoutes = require('./api/routers/auth.routes');
var waiverRoutes = require('./api/routers/waiver.routes');
var waiversRoutes = require('./api/routers/waivers.routes');
var activitiesRoutes = require('./api/routers/activities.routes');
var authorizationRoutes = require('./api/routers/authorizations.routes');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

userRoutes(app);
authRoutes(app);
waiverRoutes(app);
waiversRoutes(app);
activitiesRoutes(app);
authorizationRoutes(app);

app.listen(port,()=>{
    console.log('Server running in port ' + port)
});