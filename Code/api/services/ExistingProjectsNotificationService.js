var cron = require('node-cron');
var emailService = require('./EmailService');
var Project = require('../models/projects');
var User = require('../models/users');
var Log = require('../models/log');
var dateTimeService = require('./DateTimeService');

var sendNotification = function (app, users, projects) {
    var subject = "Existing Vip projects notification";
    var body = "The following new  projects are available right now for you to apply to:<br/><br/>";

    body += "<ul>";
    projects.forEach(function (project) {
        var url = app.get("baseWebUrl") + '/vip-projects-detailed/' + project._id;
        body += "<li><a href='" + url + "'>" + project.title + "</a></li>";
    });
    body += "</ul>";
    body += "<br/>";

    users.forEach(function(user) {
        var userBody = body + "To opt out of this notifications, click the link below<br/>" +
            "<a href='" + app.get("baseApiUrl") + "/vip/notifications/opt-out/" + user._id.toString() + "'>Disable notifications<a/>";
        emailService.sendEmailWithHeaderAndSignatureNoUser(user.email, userBody, subject, function (error) {
            console.log('Failed to send existing projects notification email to ' + user.email + ".\nWith error: " + error.toString());
        }, null);
    });
};

exports.configureNotifications = function (cronPattern, app) {
    var valid = cron.validate(cronPattern);
    if (!valid) {
        throw "Invalid cron expression set for existing projects notifications.";
    }
    cron.schedule(cronPattern, function () {
        Project.find({status: 'Active'}, '_id title', function (err, projects) {
            if (err) {
                console.log("Failed to get a list of projects from the database to send existing project notifications." +
                    "\nWith error: " + err.toString());
                return;
            }
            var today = dateTimeService.getTodaysDate().getTime();
            var yesterday = dateTimeService.getYesterdaysDate().getTime();

            var conditions = [{
                projectid: '',
                action: 'Approved',
                type: 'project'
            }];
            projects.forEach(function (project) {
                conditions.push({
                    projectid: project._id.toString(),
                    action: 'Approved',
                    type: 'project'
                });
            });
            Log.find('projectid time').or(conditions).exec(function (error, logs) {
                if (error) {
                    console.log("Failed to get the approved date of projects for sending the daily existing project notifications.");
                    return;
                }
                projects = projects.filter(function (project) {
                    var log = logs.find(function (log) {
                        return log.projectid === project._id.toString();
                    });
                    var approval = log.time.getTime();
                    return (yesterday < approval && approval <= today);//if approved yesterday
                });

                if (projects.length === 0) {
                    console.log("No active projects found to notify users about.");
                } else {
                    var error = null;
                    var users = [];

                    User.find({allowNotifications: true}, '_id email')
                        .stream().on('data', function (user) {
                        users.push(user);
                    }).on('error', function (e) {
                        error = e;
                        console.log("Failed to get a list of user emails from the database to send existing project notifications." +
                            "\nWith error: " + err.toString());
                    }).on('close', function () {
                        if (!error) {
                            sendNotification(app, users, projects);
                        }
                    });
                }
            });
        });
    }, true);
};