var passport = require('passport');
var nodemailer = require('nodemailer');
var emailService = require('../services/EmailService');
var User = require('../models/users');
var Project = require('../models/projects');
var ImpersonationLog = require('../models/impersonationLog');
var authProvider = require('../services/AuthorizationProvider');
var Key = require('../config/key');

module.exports = function (app, express) {

    var host = app.get('host');

    //Google+ Authentication
    app.get('/auth/google',
        authProvider.authorizeAll,
        passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback',
        authProvider.authorizeAll,
      //   passport.authenticate('google',
      //       {
      //           successRedirect: '/#',
      //           failureRedirect: '/status'
      //       }
      //    )
      function(req,res,next){
         passport.authenticate('google',function(err, user, info){
            console.log(user)
             if (err) {
                return res.redirect('/status');
             }
             if (!user) {
                return res.redirect('/status');
             }
             User.findOne({email: user.email}, function (error, usr) {
                usr.piApproval = true
                usr.save(function (err) {
                   console.log(err)
                });
             })
             req.login(user,function(err){
                if (err) { return next(err); }
                return res.redirect('/#');
             })
           })(req, res, next)
      }

    );

    app.get('/status',
        authProvider.authorizeAll,
        function (req, res) {
            var error = req.flash('error');
            if (error == 'Incorrect username/password.') {
                res.redirect('/#/login/error');
            } else if (error == 'Account must be verified') {
                res.redirect('/#/login/error_email');
            } else if (error == 'Must be FIU.EDU for Gmail login.') {
                res.redirect('/#/login/error_non');
            } else {
                res.redirect('/#/login/error_pi');
            }
        });

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    app.post('/login',
        authProvider.authorizeAll,
        function adminImpersonateUser(req, res, next) {//this method here allows someone logged in as a pi to impersonate any user
            if (!req.user || req.user.userType !== 'Pi/CoPi') {//if not logged in yet or logged in but not PI, proceed with regular authentication as usual
                return next();
            } else {
                User.findOne({email: req.body.email}, function (error, user) {//impersonate this user
                    if (error) {
                        return next(error);
                    } else if (user.userType === 'Pi/CoPi') {
                        return res.redirect('/#');
                    } else {
                        var adminEmail = req.user.email;
                        req.logout();
                        req.logIn(user, function (error) {
                            if (error) {
                                return next(error);
                            } else {
                                ImpersonationLog.update({ adminEmail: adminEmail},
                                    {adminEmail: adminEmail, impersonatedEmail: user.email,"connect.sid": req.cookies["connect.sid"], time: new Date()},
                                    {upsert: true}, function(err, raw) {
                                        if (err) {
                                            console.log("There was an error when saving the impersonation log for user: " + req.user.email);
                                        }
                                        res.send({redirectUrl: "/#", error: null})
                                    });
                            }
                        });
                    }
                });
            }
        },
        passport.authenticate('local', {
            successRedirect: '/#/proxy',
            failureRedirect: '/status',
            failureFlash: true
        })
    );

    // FOR LOGOUT IMPLEMENTATION
    app.get('/logout',
        authProvider.authorizeAll,
        function(req, res, next) {//for getting out of impersonation
            if (!req.user) {
                return next();
            } else if (req.user.userType === 'Pi/CoPi') {//Pi's can't be impersonated
                return next();
            } else {
                ImpersonationLog.findOne({'connect.sid': req.cookies["connect.sid"]}, function(err, log) {
                    if (err || !log || log.impersonatedEmail !== req.user.email) {
                        return next();//just logout the user
                    }
                    ImpersonationLog.remove({adminEmail: log.adminEmail}, function(err, result) {
                        if (err) {}//not sure this is a meaningful problem
                    });
                    if (new Date().getTime() - log.time.getTime() < (1000 * 60 * 60 * 72)) {//don't allow if older than 3 days
                        User.findOne({email: log.adminEmail}, function (err, user) {
                            if (err || !user) {//just logout the user
                                return next();
                            }
                            req.logout();
                            req.logIn(user, function (error) {
                                if (error) {
                                    return next();
                                } else {
                                    return res.redirect('/#');
                                }
                            });
                        });
                    } else {
                        return next();
                    }
                });
            }
        },
        function (req, res) {
            req.logout();
            res.redirect('/');
        });

    var userRouter = express.Router();

    //opt out of notifications
    userRouter.route('/notifications/opt-out/:user_id')
        .get(
            authProvider.authorizeAll,//i figured there is not reason why this should be secured
            function(req, res) {
                User.update({_id: req.params.user_id}, { allowNotifications: false }, function(err, raw) {
                    if (err) {
                        console.log("Failed to disable notifications for user with id '" + req.params.user_id + "'.\n" +
                            "Because of '" + err.toString() + "'.");
                    }
                    return res.redirect('/#/notificationsDisabled');
                });
            }
        );

    // for email verification
    userRouter.route('/verifyEmail/:user_id')
        .get(
            authProvider.authorizeAll,
            function (req, res) {
                User.findById(req.params.user_id, function (err, user) {
                    if (user === null) {
                        res.json('Invalid link. Email cannot be verified.');
                        return;
                    }

                    user.verifiedEmail = true;
                    user.save(function (err) {
                        if (err) res.send(err);
                        else {
                            res.redirect("/#emailVerified");
                        }
                    });
                });
            });

    userRouter.route('/nodeemail2')
        .post(
            authProvider.authorizeAll,
            function (req, res) {
                var recipient = req.body.vm.userData.recipient;
                var text = req.body.vm.userData.text;
                var subject = req.body.vm.userData.subject;

                emailService.sendEmailWithHeaderAndSignatureNoUser(recipient, text, subject, null, null);
            });

    userRouter.route('/nodeemail')
        .post(
            authProvider.authorizeAll,
            function (req, res) {

                var recipient = req.body.recipient;
                var text = req.body.text;
                var subject = req.body.subject;
                var bccget = req.body.bcc;

                recipient.split(',').concat(!bccget ? [] : bccget.split(',')).forEach(function (email) {
                    emailService.sendEmailWithHeaderAndSignatureNoUser(email, text, subject, null, null);
                });

                var recipient2 = req.body.recipient2;
                var text2 = req.body.text2;
                var subject2 = req.body.subject2;

                emailService.sendEmailWithHeaderAndSignatureNoUser(recipient2, text2, subject2, null, null);
            });

    userRouter.route('/users/email/:email')
        .get(
            authProvider.authorizeAll,
            function (req, res) {
                User.findOne({email: req.params.email}, function (err, user) {
                    if (err) {
                    } else {
                        if (user) {
                            return res.json(user._id);
                        }
                    }
                });
            });

    userRouter.route('/users/:id')
        .delete(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi,
                authProvider.authorizeByUserId('params.id')),
            function (req, res) {
                User.remove({_id: req.params.id}, function (err, user) {
                    if (err)
                        return res.send(err);
                    res.json({message: 'successfully deleted!'});
                });
            })
        .get(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi,
                authProvider.authorizeByUserId('params.id')),
            function (req, res) {
                User.findOne({_id: req.params.id}, function (err, user) {
                    if (err) {
                    } else if (user) {
                        return res.json(user);
                    }
                });
            });


	// Find User by Term
	userRouter.route('/users/term/:term')
        .get(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                User.find({semester: req.params.term}, function (err, users) {
                    if (err) {
						return res.send(err);
                    } else if (users) {
                        return res.json(users);
                    }
                });
            });
   userRouter.route('/usersUpdate/approveProject/:user')
      .put(
         authProvider.authorizeAll,
         function (req, res) {
            console.log('*************** HERE ****************')
            User.findById(req.params.user, function (err, user) {
               console.log(user)
               user.piProjectApproval = true
               user.save(function (err) {
                  if (err)
                     return res.send({success: false, error: err});
                  else
                     res.json({
                        success: true,
                        objectId: user._id,
                        message: 'User account updated.'
                     });
               });
            })
         }
      )
      userRouter.route('/usersUpdate/approveUser/:user')
         .put(
            authProvider.authorizeAll,
            function (req, res) {
               console.log('*************** HERE ****************')
               User.findById(req.params.user, function (err, user) {
                  console.log(user)
                  user.piApproval = true
                  user.save(function (err) {
                     if (err)
                        return res.send({success: false, error: err});
                     else
                        res.json({
                           success: true,
                           objectId: user._id,
                           message: 'User account updated.'
                        });
                  });
               })
            }
         )
      userRouter.route('/usersUpdate/unapproveUser/:user')
            .put(
               authProvider.authorizeAll,
               function (req, res) {
                  console.log('*************** HERE ****************')
                  User.findById(req.params.user, function (err, user) {
                     console.log(user)
                     user.piApproval = false
                     user.save(function (err) {
                        if (err)
                           return res.send({success: false, error: err});
                        else
                           res.json({
                              success: true,
                              objectId: user._id,
                              message: 'User account updated.'
                           });
                     });
                  })
               }
            )

    // User.create(vm.userData).success(function(data) from userRegistrationController.js calls this function
    // BUG: This function is returning success even if the user already exists in the database
    userRouter.route('/users')
        .post(
            authProvider.authorizeAll,
            function (req, res) {
                var user = new User();

                user.firstName = req.body.firstName;  // set the users name (comes from the request)
                user.lastName = req.body.lastName;  // set the users last name
                user.pantherID = req.body.pantherID;     // set the users panther ID
                user.password = req.body.password;  // set the users password (comes from the request)
                user.passwordConf = req.body.passwordConf;
                user.email = req.body.email;   // sets the users email
                user.project = req.body.project; // sets the users project
                user.rank = req.body.rank;    // set the users Rank within the program
                user.college = req.body.college;   // sets the users college
                user.department = req.body.department;
                user.RegDate = req.body.RegDate;  // sets the users college
                user.allowNotifications = true;//new users opt in to notifications by default
                user.piProjectApproval = false;
				user.googleKey = " ";
                user.userType = req.body.userType;
                user.gender = req.body.gender;
				user.semester = req.body.semester;
				user.course = req.body.course;
				user.isEnrolled = req.body.isEnrolled;

				// Called only when user is created by admin panel (us #1300)
				if (req.body.adminCreated) {
					user.piApproval = req.body.piApproval;
					if (typeof user.piApproval === 'boolean' && user.piApproval) {
						user.piDenial = false;
						user.verifiedEmail = true;
						user.isDecisionMade = true;
					}
					else if (typeof user.piApproval === 'boolean' && !user.piApproval) {
						user.piDenial = true;
						user.verifiedEmail = false;
						user.isDecisionMade = true;
					}
					else {
						user.piDenial = false;
						user.verifiedEmail = false;
						user.isDecisionMade = false;
					}

					if (user.userType == "Pi/CoPi")
						user.isSuperUser = true;
					else
						user.isSuperUser = false;
				}
                // mohsen says his and masouds accounts should automatically become verified as Pi
                else if (req.body.email == "mtahe006@fiu.edu" || req.body.email == "sadjadi@cs.fiu.edu") {
                    // give them all perms
                    user.piApproval = true;
                    user.piDenial = false;
                    user.verifiedEmail = true;
                    user.isDecisionMade = true;
                    user.isSuperUser = true;
                }
				else {
                    // initially has to be init to false
                    user.piApproval = false;
                    user.piDenial = false;
                    user.piProjectApproval = false;
                    user.verifiedEmail = false;
                    user.isDecisionMade = false;
                    // always set to false, until the user is approved as a PI
                    user.isSuperUser = false;
                }

                user.save(function (err, newUser) {
                    // an error occured while trying to insert the new user
                    if (err) {
                        // duplicate entry - user exists
                        if (err.code == 11000)
                            return res.json({success: false, message: 'A user already exists.'});//todo: error code?
                        else
                            return res.send({success: false, error: err});//todo: error code?
                    }
                    // return the object and object id for validation and message for the client
                    res.json({
                        success: true,
						object: newUser,
                        objectId: user._id,
                        message: 'User account created please verify the account via the registered email.'
                    });
                });
            })
        .put(
            authProvider.authorizeAuthenticatedUsers,//this can't be restricted any more because faculty/staff will use this from the review Project Page
            function (req, res) {
                User.findById(req.body.user._id, function (err, user) {
                    if (user) {
                        user.firstName = req.body.user.firstName;  // set the users name (comes from the request)
                        user.lastName = req.body.user.lastName;  // set the users last name
                        user.pantherID = req.body.user.pantherID;     // set the users panther ID
                        user.password = req.body.user.password;  // set the users password (comes from the request)
                        user.passwordConf = req.body.user.passwordConf;
						user.gender = req.body.user.gender;
                        user.email = req.body.user.email;   // sets the users email
                        user.project = req.body.user.project; // sets the users project
						user.userType = req.body.user.userType;
                        user.rank = req.body.user.rank;    // set the users Rank within the program
                        user.college = req.body.user.college;   // sets the users college
                        user.department = req.body.user.department;  // sets the users college
                        user.joined_project = req.body.user.joined_project;
						user.semester = req.body.user.semester;
						user.piApproval = req.body.user.piApproval;
						user.course = req.body.user.course;
						user.isEnrolled = req.body.user.isEnrolled;
            user.piProjectApproval = false;

						if (typeof user.piApproval === 'boolean' && user.piApproval) {
							user.piDenial = false;
							user.verifiedEmail = true;
							user.isDecisionMade = true;
						}
						else if (typeof user.piApproval === 'boolean' && !user.piApproval) {
							user.piDenial = true;
							user.verifiedEmail = false;
							user.isDecisionMade = true;
						}
						else {
							user.piDenial = false;
							user.verifiedEmail = false;
							user.isDecisionMade = false;
						}

						if (user.userType == "Pi/CoPi")
							user.isSuperUser = true;
						else
							user.isSuperUser = false;

                        user.save(function (err) {
                            if (err)
								return res.send({success: false, error: err});
							else
								res.json({
									success: true,
									objectId: user._id,
									message: 'User account updated.'
								});
                        });
                    }
                });
            });


             //User story 1356 - API endpoint for consumption by Mobile Judge
             userRouter.route('/api/getAll/:token')
             .get(authProvider.authorizeAll,

                 function(req, res) {
                     //simple token authentication - see config
                     if(Key.key === req.params.token) {
                    //get the enrolled list
                    User.find({ isEnrolled: true, course: { $ne: null } },
                    'email pantherID firstName lastName project course',
                                function(err, users) {
                                    if (err) {
                                        return res.send(err);
                                    } else if (users) {
                                        var userPromises = [];
                                        users.map(function(user){
                                            userPromises.push(  new Promise(function(resolve, reject){
                                                Project.findOne({ title: user.project }, function(err, proj){

                                                    if(err){
                                                        reject('')
                                                    }

                                                        //map to custom object for MJ
                                                        var tempObj = {
                                                            email : user.email,
                                                            id : user.pantherID,
                                                            firstName: user.firstName,
                                                            lastName: user.lastName,
                                                            middle: null,
                                                            valid: true,
                                                            projectTitle: user.project,
                                                            projectId:  proj ? proj._id : null,
                                                            course: user.course
                                                        }

                                                        console.log(tempObj)
                                                        resolve(tempObj)



                                                })
                                            })
                                         )
                                    })
                                    //async wait and set
                                    Promise.all(userPromises).then(function(results){
                                        res.json(results)
                                    }).catch(function(err){
                                        res.send(err)
                                    })
                                }
                            })



                    } else {
                        return  res.json( {msg: "Token not authorized, please see your admin"})
                    }
                 });

    return userRouter;
};
