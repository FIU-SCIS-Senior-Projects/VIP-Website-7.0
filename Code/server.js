//base setup michael
var express		= require('express');
var nodemailer = require('nodemailer');
var dateTimeService = require('./api/services/DateTimeService');
var mongoose	        = require('mongoose');
var passport			= require('passport');
var cookieParser		= require('cookie-parser');
var flash				= require('connect-flash');
var session             = require('express-session');
var bodyParser	        = require('body-parser');
var path		= require('path');
var fs = require('fs');
var config		= require('./api/config/config');
var app			= express();

//Set HOST
app.set("host", "localhost");
app.set("protocol", "http");
app.set("baseApiUrl", app.get("protocol") + "://" + app.get("host") + ":" + config.externalPort);
app.set("baseWebUrl", app.get("baseApiUrl") + "/#");

require('./deployment/gulpfile')(__dirname + '/webapp/');//this will take care to generate the distrib js and css files.
require('./api/services/ExistingProjectsNotificationService').configureNotifications('0 0 3 * * *', app);//setup existing projects notifications as daily

//connect to mongodb
mongoose.connect(config.database, { server: { poolSize: 30 } });
mongoose.connection.on('error', function(err) {
	//console.log('Error: could not connect to MongoDB.');
});

if (config.secure) {//redirect http to https
    app.all('*', function (req, res, next) {
		if (req.secure) {
			return next();
		}
		res.redirect('https://' + req.hostname + req.url);
    });
}

require('./api/config/passport')(passport,app);
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(cookieParser());

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

app.use(session({
    secret: 'ThisIsMyDirtyLittleSecretChocolatebunniesson',
    cookie: {
        expires: dateTimeService.getDateOneYearFromNow()
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/webapp', { maxage: '1d' }));
app.set('root',__dirname + '/webapp');

var userRoutes = require('./api/routes/userRoutes')(app, express);
var projectRoutes = require('./api/routes/projectsRoutes')(app,express);
var toDoRoutes = require('./api/routes/toDoRoutes')(app,express);
var profileRoutes = require('./api/routes/profileApi')(app,express);
var supportRoutes = require('./api/routes/support')(app,express);
var logRoutes = require('./api/routes/logRoutes')(app,express);
var settingsRoutes = require('./api/routes/settingsRoutes')(app,express);
var skillsRoutes = require('./api/routes/skillsRoutes')(app, express);


app.use('/api', projectRoutes);
app.use('/vip', userRoutes);
app.use('/api', profileRoutes);
app.use('/todo', toDoRoutes);
app.use('/support', supportRoutes);
app.use('/log', logRoutes);
app.use('/settings', settingsRoutes);
app.use('/api', skillsRoutes);


//home page
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/webapp/index.html'));
});

var http = require('http');
var https = require('https');

if (config.secure) {
    var privateKey = fs.readFileSync(__dirname + '/privkey.pem');
    var certificate = fs.readFileSync(__dirname + '/cert.pem');
    var authority = fs.readFileSync(__dirname + '/chain.pem');

    https.createServer({
        key: privateKey,
        cert: certificate,
        ca: authority
    }, app).listen(443);
    http.createServer(app).listen(config.port);
} else {
    app.listen(config.port);
}