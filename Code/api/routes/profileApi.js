var Profile = require('../models/users');
var passport = require('passport');
var request = require('request');
var authProvider = require('../services/AuthorizationProvider');
var Settings = require('../models/settings');
var Project = require('../models/projects')

module.exports = function (app, express) {
    var apiRouter = express.Router();
    var host = app.get("host");
    var protocol = app.get("protocol");
    var baseWebUrl = app.get("baseWebUrl");

    // updates profile based on data submitted when applying for a project
    apiRouter.route('/updateprofileproject')
        .put(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {

                Profile.findById(req.body._id, function (err, profile) {
                    profile.rank = req.body.rank;
                    profile.pantherID = req.body.pantherID;
                    profile.college = req.body.college;
                    profile.school = req.body.school;
                    profile.gender = req.body.gender;
                    profile.department = req.body.department;
                    // User Story #1144
                    profile.skillItem = req.body.skillItem;
                    profile.vipcredit = req.body.vipcredit;
                    profile.volunteer = req.body.volunteer;
                    profile.independentstudy = req.body.independentstudy;
                    // User Story #1208
                    profile.appliedDate = req.body.appliedDate;


                    // Adding semester to database
                    profile.semester = req.body.semester;

                    profile.save(function (err) {
                        if (err) res.send(err);
                        res.json(profile);
                    })
                });
            });

    // used to update the rank/usertype of a profile that the PI has authorized the changes to
    apiRouter.route('/updateprofile')
        .put(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {

                Profile.findById(req.body._id, function (err, profile) {
                    ////console.log(req.body);
                    // populate all values
                    profile.firstName = req.body.firstName;
                    profile.lastName = req.body.lastName;
                    profile.college = req.body.college;
                    profile.department = req.body.department;
                    profile.gender = req.body.gender;
                    profile.minor = req.body.minor;
                    profile.pantherID = req.body.pantherID;
                    profile.major = req.body.major;
                    profile.rank = req.body.rank;
                    profile.isApproved = req.body.isApproved;
                    profile.userType = req.body.userType;
                    profile.google = req.body.google;
                    profile.image = req.body.image;
                    profile.resume = req.body.resume;
                    profile.modifying = req.body.modifying;
                    profile.isDecisionMade = req.body.isDecisionMade;
                    profile.joined_project = req.body.joined_project;
                    // User Story #1144
                    profile.skillItem = req.body.skillItem;
                    profile.vipcredit = req.body.vipcredit;
                    profile.volunteer = req.body.volunteer;
                    profile.independentstudy = req.body.independentstudy;
                    // User Story #1208
                    profile.appliedDate = req.body.appliedDate;
                    // User Story #1209
                    profile.RegDate = req.body.RegDate;

                    // we only update userType with approval
                    if (profile.isApproved) {
                        // only update usertype if user requested it
                        if (profile.requested_userType != null) {
                            // if the user has been accepted as Pi/CoPi, make them a superuser as well
                            if (profile.requested_userType == "Pi/CoPi") {
                                ////console.log("Set SUPERUSER");
                                profile.isSuperUser = 1;
                            }

                            // set the usertype to the requested usertype
                            profile.userType = profile.requested_userType;
                        }
                    }

                    // remove the requested vars from db
                    profile.requested_userType = null;
                    profile.requested_rank = null;

                    // update users rank
                    profile.save(function (err) {
                        if (err) res.send(err);
                        res.json(profile);
                    })

                    /* notify user that the profile has been accepted */
                    // init
                    var vm = {};
                    vm.userData = {};
                    var host = req.get('host');

                    // build the path to the nodeemail script
                    var postDomain = "http://" + "127.0.0.1:3000" + "/vip/nodeemail2";
                    var reviewDomain = "http://" + host + "/#/profile";

                    // recipient email(s)
                    vm.userData.recipient = profile.email;

                    if (profile.modifying) {
                        // email body text
                        vm.userData.text = "An admin has changed your usertype. You can view your new profile information by visiting this URL: " + reviewDomain;

                        // email subject line
                        vm.userData.subject = "Profile Changes have been changed";
                    } else if (profile.isApproved || profile.google) {// define the message if a user has been approved
                        // email body text
                        vm.userData.text = "Your request to update your profile has been approved. You can view your new profile information by visiting this URL: " + reviewDomain;

                        // email subject line
                        vm.userData.subject = "Profile Changes have been Approved";
                    } else {// define the message if a user has been rejected
                        // email body text
                        vm.userData.text = "Unfortunantly, your request to update your profile has been rejected. You can view your current profile information by visiting this URL: " + reviewDomain;

                        // email subject line
                        vm.userData.subject = "Profile Changes have been Denied";
                    }

                    // deploy email
                    request.post(
                        postDomain,
                        {form: {vm}},
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                            }
                        }
                    );
                });
            });

    apiRouter.route('/profile')
        .put(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi,
                authProvider.authorizeByUserId('body._id')),
            function (req, res) {
                Profile.findById(req.body._id, function (err, profile) {
                    // note to future devs: "profile.rank" is the users current rank in database, "req.body.rank" is the rank they are attempting to obtain

                    var isUserTypeUpdateRequest = false;
                    profile.allowNotifications = req.body.allowNotifications;

                    // set superuser status for a newly approved PI account
                    if (!profile.isSuperUser && profile.userType == "Pi/CoPi") {
                        ////console.log("User has been approved by PI, and is a PI himself, elevate privs");
                        profile.isSuperUser = true;
                    }

                    // profile has been accepted or rejected, update in db
                    if (!profile.isDecisionMade && req.body.isDecisionMade) {
                        profile.isDecisionMade = req.body.isDecisionMade;
                    }

                    // populate nonsensitive values
                    profile.firstName = req.body.firstName;
                    profile.lastName = req.body.lastName;
					profile.email = req.body.email;
                    profile.college = req.body.college;
                    profile.department = req.body.department;
                    profile.gender = req.body.gender;
                    profile.minor = req.body.minor;
                    profile.pantherID = req.body.pantherID;
                    profile.major = req.body.major;
                    profile.modifying = req.body.modifying;
                    // all user types are allowed to update their ranks without approval
                    profile.rank = req.body.rank;
                    profile.image = req.body.image;
                    profile.resume = req.body.resume;

                    // User Story #1144
                    profile.skillItem = req.body.skillItem;
                    profile.vipcredit = req.body.vipcredit;
                    profile.volunteer = req.body.volunteer;
                    profile.independentstudy = req.body.independentstudy;
                    // this field will be set to true if the acceptProfile() function called us
                    if( req.body.selectedSemester ) {
                      profile.selectedSemester = req.body.selectedSemester;
                    }
                    if (req.body.piApproval) {
                        profile.piApproval = req.body.piApproval;
                    } else if (req.body.piDenial && req.body.isDecisionMade) {
                        //console.log("Rejected account like most girls do to me...\nnow attempting to delete account forever!");
                        profile.remove(function (err) {
                            if (err) {
                                console.log("Failed to delete account!");
                            }
                        });
                    } else {
                        profile.modifying = null;
                    }

                    // user is privileged and should be allowed to update userType without approval
                    if (profile.isSuperUser) {
                        profile.userType = req.body.userType;
                    } else {// user needs approval before updating the userType
                        if (profile.userType != req.body.userType) {// user is trying to change their account usertype
                            isUserTypeUpdateRequest = true;

                            // set temporary requested_rank userType database
                            profile.requested_userType = req.body.userType;
                        }
                    }

                    // new account approved, send account approval email
                    if (req.body.__v == 1) {
                        // init
                        var vm = {};
                        vm.userData = {};
                        var host = req.get('host');

                        // build the path to the nodeemail script
                        var postDomain = "http://" + "127.0.0.1:3000" + "/vip/nodeemail2";

                        // user ID in database for cross-reference
                        vm.objectId = profile.objectId;

                        // recipient email(s)
                        vm.userData.recipient = profile.email;

                        // email body text
                        vm.userData.text = "Congratulations, your account for VIP has been approved! You may now login at " + baseWebUrl + "/login";

                        // email subject line
                        vm.userData.subject = "Your VIP Account has been Approved";

                        ////console.log("Sending account approval email");

                        // deploy email
                        request.post(
                            postDomain,
                            {form: {vm}},
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                }
                            }
                        );
                    }

                    // new account approved, send account approval email
                    if (req.body.__v == 2) {
                        // init
                        var vm = {};
                        vm.userData = {};
                        var host = req.get('host');

                        // build the path to the nodeemail script
                        var postDomain = "http://" + "127.0.0.1:3000" + "/vip/nodeemail2";

                        // user ID in database for cross-reference
                        vm.objectId = profile.objectId;

                        // recipient email(s)
                        vm.userData.recipient = profile.email;

                        // email body text
                        vm.userData.text = "Unfortunately, your account for VIP was not approved. You may attempt to register a new account at " + baseWebUrl + "/registration.";

                        // email subject line
                        vm.userData.subject = "Sorry, your VIP Account has been Rejected";

                        // deploy email
                        request.post(
                            postDomain,
                            {form: {vm}},
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                }
                            }
                        );
                    }

                    // new account approved, and email verified, send account approval email
                    if (req.body.__v == 3) {
                        profile.verifiedEmail = true;
                        // init
                        var vm = {};
                        vm.userData = {};
                        var host = req.get('host');

                        // build the path to the nodeemail script
                        var postDomain = "http://" + "127.0.0.1:3000" + "/vip/nodeemail2";

                        // user ID in database for cross-reference
                        vm.objectId = profile.objectId;

                        // recipient email(s)
                        vm.userData.recipient = profile.email;

                        // email body text
                        vm.userData.text = "Congratulations, your account and email for VIP has been approved!  You may now login at " + baseWebUrl + "/login";

                        // email subject line
                        vm.userData.subject = "Your VIP Account has been Approved";

                        // deploy email
                        request.post(
                            postDomain,
                            {form: {vm}},
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                }
                            }
                        );
                    }
// User Story #1140
                    if (req.body.__v == 4) {
                        profile.piDenial = false;
                        profile.isDecisionMade = false;
                        profile.piApproval = false;

                        var vm = {};
                        vm.userData = {};
                        var host = req.get('host');
                        var postDomain = "http://" + "127.0.0.1:3000" + "/vip/nodeemail2";
                        vm.objectId = profile.objectId;
                        vm.userData.recipient = profile.email;
                        vm.userData.text = "Currently, Your profile has been kept on HOLD! by the admin. You will be informed if admin approves or rejects your account. Sorry for the inconvenience";
                        vm.userData.subject = "Your VIP Account has been kept on HOLD!";
                        request.post(
                            postDomain,
                            {form: {vm}},
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                }

                            }
                        );
                    }

                    // update profile, "Rank" and "userType" changes will be handled below this, it's impossible to update those values here
                    // request values will be populated in the DB here
                    profile.save(function (err) {
                        if (err) res.send(err);
                        res.json(profile);
                    });

                    // user wants to update "Rank" or "userType", send PI an email to accept/reject the request
                    if (isUserTypeUpdateRequest && !profile.modifying) {
                        // init
                        var vm = {};
                        vm.userData = {};
                        var host = req.get('host');

                        // build the path to the nodeemail script
                        var postDomain = "http://" + "127.0.0.1:3000" + "/vip/nodeemail2";
                        var reviewDomain = "http://" + host + "/#/verifyprofile/" + profile._id;

                        // user ID in database for cross-reference
                        vm.objectId = profile.objectId;

                        // email body text
                        vm.userData.text = profile.firstName + " " + profile.lastName + " is attempting to update their userType FROM "
                            + profile.userType + " TO " + profile.requested_userType + ".\n\n Accept/Reject the changes using this URL: " + reviewDomain;

                        // email subject line
                        vm.userData.subject = "Profile update request from " + profile.firstName + " " + profile.lastName;

                        Settings.findOne({owner: "admin"}, function (error, setting) {
                            if (error) {
                                console.log("Failed to send admin notification email due to a problem retrieving the admin email." +
                                    "\n" + error.toString());
                                return;
                            }
                            vm.userData.recipient = setting.current_email;

                            request.post(
                                postDomain,
                                {form: {vm}},
                                function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                    }
                                }
                            );
                        });
                    }
                });
            })

        .get(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                Profile.find({email: req.user.email}, function (err, profile) {
                    if (err) {
                        ////console.log(err);
                        return res.send('error');
                    }
                    return res.json(profile);
                });
            });

    apiRouter.route('/profile/:email')
        .get(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                Profile.find({email: req.user.email}, function (err, profile) {
                    if (err) {
                        return res.send('error');
                    }
                    return res.json(profile);
                });
            });

    apiRouter.route('/profilestudent/:id')
        .get(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                var id = req.params.id;
                Profile.findOne({_id: id}, function (err, profile) {
                    if (err) {
                        return res.send('error');
                    }
                    return res.json(profile);
                });
            });

    //Set joinedproject to false
    apiRouter.route('/profilejoinedproject/:id')
        .put(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi, authProvider.userType.StaffFaculty]),
            function (req, res) {
                var id = req.params.id;
                Profile.findOne({_id: id}, function (err, profile) {
                    if (err) {
                        res.send(err);
                        res.json({message: 'Error!'});
                    }
                    else if (profile) {
                        profile.joined_project = false;
                        profile.save(function (err) {
                            if (err) {
                                res.status(400);
                                res.send(err);
                            }
                            res.json(profile);
                        });
                    }
                });
            });


    apiRouter.route('/reviewuser/:email')
        .get(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi, authProvider.userType.StaffFaculty]),
            function (req, res) {
                Profile.find({joined_project:false}, function (err, profile) {//todo: performance issue, sending every record in the database in every response is not a good idea
                    if (err) {
                        return res.send('error');
                    }
                  //   console.log(profile)
                    var userProfilesPromises = []
                    profile.map(info => {
                       console.log('###################')
                       console.log(info.project)
                       if(info.project){
                          userProfilesPromises.push(
                             new Promise((resolve,reject)=>{
                                console.log(info.project)
                                Project.findOne({members: info.email,owner_email:req.params.email},function(err,project){
                                 //   console.log("*************")
                                 //   console.log(project)
                                   if(err){
                                      console.log(err)
                                      reject('')
                                   }
                                   if(project){
                                    //  console.log(project.owner_email)
                                     var prof = Object.assign({},info._doc,{
                                        owner_email: project.owner_email
                                     })
                                     console.log(prof)
                                     resolve(prof)
                                  }else{
                                     console.log('in reject')
                                     resolve('')
                                  }
                               })
                             })
                          )
                       }
                    })
                  //   console.log(userProfilesPromises)
                     Promise.all(userProfilesPromises).then(results=>{
                     //   console.log(results)
                       return res.send(results)
                    }).catch(err=>{
                       console.log(err)
                    })
                  //   return res.json(userProfiles);
                });
            });

    // User Story #1140
    apiRouter.route('/reviewuser/:user_id')
        .get(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi, authProvider.userType.StaffFaculty]),
            function (req, res) {
                Profile.findById(req.params.user_id, function (err, profile) {
                    if (profile == null) {
                        res.json('Invalid link. User cannot be verified.');
                    } else {
                        res.json(profile);
                    }
                });
            });

    //route for adding a member to a project(after approval)
    apiRouter.route('/reviewusers/:userid/:pid')
        .put(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi, authProvider.userType.StaffFaculty]),
            function (req, res) {
                var id = req.params.userid;
                var pid = req.params.pid;
                Profile.findOne({_id: id}, function (err, profile) {
                    if (err) {
                        res.send(err);
                        res.json({message: 'Error!'});
                    }
                    else if (profile) {
                        profile.project = pid;
                        profile.save(function (err) {
                            if (err) {
                                res.status(400);
                                res.send(err);
                            }
                            res.json({message: 'Project Id Added to Users Profile'});
                        })
                    }
                });
            });

    apiRouter.route('/verifyuser/:user_id')
        .get(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi]),
            function (req, res) {
                Profile.findById(req.params.user_id, function (err, profile) {
                    if (profile == null) {
                        res.json('Invalid link. User cannot be verified.');
                        return;
                    } else {
                        res.json(profile);
                    }
                });
            });

    //Gets all users
    apiRouter.route('/getallusers')
        .get(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi, authProvider.userType.StaffFaculty]),
            function (req, res) {
                Profile.find({}, function (err, prof) {
                    if (!err) {
                        res.json(prof);
                    } else {
                        res.json('Error getting all users.');
                    }
                });
            });

    return apiRouter;
};
