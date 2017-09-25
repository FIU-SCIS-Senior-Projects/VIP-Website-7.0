var bodyParser = require('body-parser');
var Project = require('../models/projects');
var Term = require('../models/terms');
var authProvider = require('../services/AuthorizationProvider');


module.exports = function (app, express) {
    var apiRouter = express.Router();
    var currentTerm;

    /*
     *Temporal Seed for the terms Starts here
     */
    ////console.log("Seed file start");
    var termsSeed = [
        {
            name: "Spring 2017",
            start: new Date(2017, 1),
            end: new Date(2017, 5),
            deadline: new Date(2017, 1),
            active: false
        }, {
            name: "Summer 2017",
            start: new Date(2017, 5),
            end: new Date(2017, 8),
            deadline: new Date(2017, 5),
            active: false
        }, {
            name: "Fall 2016",
            start: new Date(2016, 8),
            end: new Date(2016, 12),
            deadline: new Date(2016, 8),
            active: false
        }, {
            name: 'Fall 2017',
            start: new Date(2017, 8),
            end: new Date(2017, 12),
            deadline: new Date(2017, 8),
            active: true
        }
    ];
    var findActiveTerm = function () {
        Term.find({active: true}, function (err, term) {
            if (err) {
                throw "Failed to find the active term."
            }
            currentTerm = term;
        });
    }

    Term.count(function (err, count) {
        if (err) {
            throw "Couldn't get terms count from database to setup seeded term data."
        } else if (count === 0) {
            Term.create(termsSeed, function (err) {
                if (err) {
                    throw "Failed to insert seed data records in the terms mongo collection."
                }
                findActiveTerm()//note find active term has to be called here to avoid a possible race condition where we would attempt to get the active term before mongo has actually written the seed data to the collection
            });
        } else {
            findActiveTerm()
        }
    });

    /*
     *Temporal Seed for the terms Ends here
     */
    apiRouter.route('/terms')
        .post(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                Term.create(req.body, function (err) {
                    if (err) {
                        //console.log("Error:");
                        //console.log(err);
                        return res.send('something went wrong');
                    } else {
                        //console.log("Term Test Message");
                        res.send('Term added');
                    }
                });
            })
        .get(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                Term.find({active: true}, function (err, terms) {

                    if (err) {
                        ////console.log(err);
                        return res.send('error');
                    }
                    ////console.log("Got Current Term");

                    return res.json(terms);
                });
            });
    apiRouter.route('/terms/:id')
        .put(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),//it doesn't seem to be needed by any other users
            function (req, res) {
                Term.findById(req.params.id, function (err, term) {
                    if (err) {
                        res.status(400);
                        res.send(err);
                    }

                    term.status = req.body.status;
                    term.start = req.body.start;
                    term.end = req.body.end;
                    term.deadline = req.body.deadline;
                    term.active = req.body.active;
                    if (req.body.name !== "")
                        term.name = req.body.name;

                    term.save(function (err) {
                        if (err) {
                            res.status(400);
                            return res.send(err);
                        }
                        res.json({message: 'Updated!'});
                    });
                });
            })
        .get(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                Term.findById(req.params.id, function (err, term) {
                    if (err)
                        return res.send(err);
                    res.json(term);
                });
            })
        .delete(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                Term.remove({_id: req.params.id}, function (err, term) {
                    if (err)
                        return res.send(err);
                    res.json({message: 'successfully deleted!'});
                });
            });
    //route get or adding projects to a users account
    apiRouter.route('/projects')
        .post(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi, authProvider.userType.StaffFaculty]),
            function (req, res) {
                console.log(req.body.faculty);
                req.body.term = currentTerm[0]._id;

                //Validate to ensure student counts isn't negative or student count is greater than maximum.
                var studentCount = 0;
                var maxStudentCount = 0;

                // user provided a min number of students
                if (req.body.firstSemester)
                    studentCount = Number(req.body.firstSemester);

                // user provided a max number of students
                if (req.body.maxStudents)
                    maxStudentCount = Number(req.body.maxStudents);

                // user didnt supply a min and max number of students, make it a really big number so anyone can join
                if (isNaN(studentCount) || isNaN(maxStudentCount)) {
                    req.body.firstSemester = "1";
                    req.body.maxStudents = "256";
                }

                // user didnt supply a min and max number of students, make it a really big number so anyone can join
                if (studentCount == 0 && maxStudentCount == 0) {
                    req.body.firstSemester = "1";
                    req.body.maxStudents = "256";
                }

                if (studentCount < 0 || maxStudentCount < 0) {
                    res.status(400);
                    return res.send("firstSemester cannot be less than 0 or maxStudents cannot be less than 0.");
                }

                if (studentCount > maxStudentCount) {
                    res.status(400);
                    return res.send("Count cannot be greater than the maximum.");
                }

                Project.create(req.body, function (err) {
                    if (err) {
                        res.status(400);
                        return res.send(err);
                    }
                    return res.json({success: true});
                });
            })
        .get(
            authProvider.authorizeAll,
            function (req, res) {
                Project.find({term: currentTerm[0]._id}, function (err, projects) {
                    console.log(currentTerm[0]._id);
                    if (err) {
                        console.log(err);
                        return res.send('error');
                    }
                    return res.json(projects);
                });
            });

    apiRouter.route('/projects/:id')
        .put(
            /*  Note this is still not secure and has to be completely redesigned. For instance,
             a student(any user) can change the owner of the project, another instance/problem, any user, can set
             the list of project users to empty. This will need to be broken down into several methods and change
             the corresponding front end code to call the right methods so that each method can be appropriately
             secured.
             */
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                Project.findById(req.params.id, function (err, proj) {
                    if (err) {
                        return res.status(400).send(err);
                    }

                    if (req.body.image) {
                        console.log("new image : " + req.body.image);
                        proj.image = req.body.image;
                    }

                    // Adding semester to database
                    proj.video_url = req.body.video_url;
                    proj.edited = req.body.edited;
                    proj.status = req.body.status;
                    proj.faculty = req.body.faculty;
                    proj.mentor = req.body.mentor;
                    proj.addedStudents = req.body.addedStudents;
                    proj.owner_name = req.body.owner_name;
                    proj.owner_email = req.body.owner_email;
                    proj.old_project = req.body.old_project;
                    //updating the required skill item and semester - snaku001
                    proj.reqskillItem = req.body.reqskillItem;
                    proj.semester = req.body.semester;

                    if (req.body.title !== "") proj.title = req.body.title;
                    if (req.body.description !== "") proj.description = req.body.description;
                    if (req.body.disciplines !== "") proj.disciplines = req.body.disciplines;
                    if (req.body.firstSemester !== "") proj.firstSemester = req.body.firstSemester;
                    if (req.body.maxStudents !== "") proj.maxStudents = req.body.maxStudents;
                    if (req.body.members.length > proj.maxStudents) {
                        res.status(400);
                        return res.send("Max capacity reached no more students can join");
                    } else {
                        proj.members = req.body.members;
                    }
                    if (req.body.members_detailed.length > proj.maxStudents) {
                        res.status(400);
                        return res.send("Max capacity reached no more students can join");
                    } else {
                        proj.members_detailed = req.body.members_detailed;
                    }
                    proj.save(function (err) {
                        if (err) {
                            res.status(400);
                            return res.send(err);
                        }
                        res.json({message: 'Updated!'});
                    });
                });
            })
        .get(
            authProvider.authorizeAll,
            function (req, res) {
                Project.findById(req.params.id, function (err, proj) {
                    if (err)
                        return res.send(err);//todo: missing error code
                    res.json(proj);
                });
            })
        .delete(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi,
                authProvider.authorizeProjectOwner('params.id')),
            function (req, res) {
                Project.remove({_id: req.params.id}, function (err, proj) {
                    if (err)
                        return res.send(err);
                    res.json({message: 'successfully deleted!'});
                });
            });

    //route for removing a member from a project (members in project are treated as student applications for the project)
    apiRouter.route('/project/:id/:members/:detailed')
        .put(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi,
                authProvider.authorizeProjectOwner('params.id',
                    authProvider.authorizeByUserEmail('params.members'))),
            function (req, res) {
                var id = req.params.id;
                var memberemail = req.params.members;
                var members_detailed = req.params.detailed;
                if (memberemail != null) {
                    Project.findOne({_id: id}, function (err, proj) {
                        if (err) {
                            return res.send(err);
                        } else if (proj) {
                            console.log("Members: " + memberemail + " Detailed: " + members_detailed);
                            proj.members.pull(memberemail);
                            proj.members_detailed.pull(members_detailed);
                            proj.save(function (err) {
                                if (err) {
                                    res.status(400);
                                    return res.send(err);
                                }
                                res.json({message: 'Application Removed from Project'});
                            });
                        }
                    });
                }
            });

    //route for checking pending projects
    apiRouter.route('/reviewproject')
        .get(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                Project.find({
                    $or: [{term: currentTerm[0]._id, status: "pending"}, {
                        term: currentTerm[0]._id, status: "modified"
                    }]
                }, function (err, projects) {
                    if (err) {
                        console.log(err);
                        return res.send('error');
                    }
                    return res.json(projects);
                });
            });

    //route for accepting pending projects
    apiRouter.route('/reviewproject/:id')
        .put(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                Project.findById(req.params.id, function (err, proj) {
                    if (err) {
                        res.status(400);
                        return res.send(err);
                    }
                    proj.status = 'Active';
                    proj.old_project = undefined;
                    proj.save(function (err) {
                        if (err) {
                            res.status(400);
                            return res.send(err);
                        }
                        res.json({message: 'Approved!'});
                    });
                });
            })
        .delete(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                Project.remove({_id: req.params.id}, function (err, proj) {
                    if (err)
                        return res.send(err);//missing error code
                    res.json({message: 'successfully deleted!'});
                });
            });

    //route for making an approved project back to a pending project
    apiRouter.route('/reviewproject/:pid/:project')
        .put(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
            ////console.log("PUT /reviewproject/:pid/:project "  );
            Project.findById(req.params.pid, function (err, proj) {
                if (err) {
                    res.status(400);
                    return res.send(err);
                }
                proj.status = 'pending';
                proj.save(function (err) {
                    if (err) {
                        res.status(400);
                        return res.send(err);
                    }
                    res.json({message: 'Success: Active project turned into a pending project!'});
                });
            });
        });

    return apiRouter;
};
