var uploadProposalClass = {
    image: null,
    docuUpload: null,
    deliverableUpload: null,


    uploadImage2: function() {

        var obj = document.getElementById('teamImage');
        var pI = document.getElementById('pI');
        pI.max = 100;
        pI.value = 0;
        if (obj.files.length == 0) {

        }
        else {
            pI.style.visibility = "visible";

            var f = obj.files[0];
            var r = new FileReader();
            r.onprogress = function (event) {
                if (event.lengthComputable) {
                    pI.max = event.total;
                    pI.value = event.loaded;
                }
            };
            r.onloadend = function (e) {

                var dataURL = e.target.result;
                uploadProposalClass.image = dataURL;

            }
            r.readAsDataURL(f);
        }
    },

    uploadDoc: function() {

            var objDoc = document.getElementById('project.projDoc');
            var pD = document.getElementById('pD');
            pD.max = 100;
            pD.value = 0;
            if (objDoc.files.length == 0) {

            }
            else {
                pD.style.visibility = "visible";

                var fattach = objDoc.files[0];
                var rattach = new FileReader();
                rattach.onprogress = function (event) {
                    if (event.lengthComputable) {
                        pD.max = event.total;
                        pD.value = event.loaded;
                    }
                };
                rattach.onloadend = function (e) {

                    var dataDocURL = e.target.result;
                    uploadProposalClass.docuUpload = dataDocURL;
                    //console.log("Upload URL " + uploadProposalClass.docuUpload);

                }
                rattach.readAsDataURL(fattach);
                //console.log("Upload " + r.readAsDataURL(f));
            }
        },

        uploadDeliverable: function() {

                var objDeliver = document.getElementById('project.projDeliverable');
                var pDv = document.getElementById('pDv');
                pDv.max = 100;
                pDv.value = 0;
                if (objDeliver.files.length == 0) {

                }
                else {
                    pDv.style.visibility = "visible";

                    var fdattach = objDeliver.files[0];
                    var rdattach = new FileReader();
                    rdattach.onprogress = function (event) {
                        if (event.lengthComputable) {
                            pDv.max = event.total;
                            pDv.value = event.loaded;
                        }
                    };
                    rdattach.onloadend = function (e) {

                        var dataDeliverableURL = e.target.result;
                        uploadProposalClass.deliverableUpload = dataDeliverableURL;
                    }
                    rdattach.readAsDataURL(fdattach);
                }
            }
};

(function () {

    angular.module('ProjectProposalController', ['ProjectProposalService', 'userService', 'toDoModule', 'vip-projects'])
        .controller('ProjectProposalController', function ($window, $location, $scope, DateTimeService, LocationService,
                                                           User, ProfileService, ProjectService, reviewStudentAppService,
                                                           ToDoService, $stateParams, $rootScope, adminService, SkillsService) {


            var profile;
            var vm = this;
            $scope.done = false;

            vm.adminEmail;
            adminService.getAdminSettings().then(function (data)
            {
                var adminData;
                adminData = data;
                console.log(adminData);
                console.log(adminData.current_email);
                vm.adminEmail = adminData.current_email;
                getPreviousProjects()
            });

            $scope.proposeFilter = function(input) {
              return input.status.openForProposal == true;
            };

            // check permissions and get data
            ProfileService.loadProfile().then(function (data) {
                if (data) {
                    profile = data;

                    // students cannot submit proposals, only Pi/CoPi and Faculty/Staff
                    if (profile.userType == "Student") {
                        $location.path("/").replace();
                        $window.location.href = "/#/";
                    }

                    $scope.done = true;
                }
            });

            //Joe Use Story
            // Semester Dropdown
            // vm.semesters = ['Spring 2017', 'Summer 2017', 'Fall 2017'];
            6
            $scope.colleges = [
                {
                    name: 'Architecture & The Arts',
                    schools: [
                        'Architecture',
                        'Interior Architecture',
                        'Landscape Architecture and Environmental Urban Design',
                        'Art and Art History',
                        'Communication Arts',
                        'School of Music',
                        'Theatre']
                },
                {
                    name: 'Arts and Sciences & Education',
                    schools: [
                        'Biological Sciences',
                        'Chemistry and Biochemistry',
                        'Earth and Environment',
                        'English',
                        'Mathematics and Statistics',
                        'Philosophy',
                        'Physics',
                        'Psychology',
                        'Teaching and Learning',
                        'Leadership and Professional Studies',
                        'School of Education',
                        'School of Enviroment, Arts & Society',
                        'School of Integrated Science & Humanity'
                    ]
                },
                {
                    name: 'Business',
                    schools: [
                        'Decision Sciences and Information Systems',
                        'Alvah H. Chapman Jr. Graduate School of Business',
                        'R. Kirk Landon Undergraduate School of Business',
                        'Finance',
                        'Management and International Business',
                        'Marketing',
                        'School of Accounting',
                        'Real Estate'
                    ]
                },
                {
                    name: 'Chaplin School of Hospitality and Tourism Management',
                    schools: [
                        'Hospitality and Tourism Management'
                    ]
                },
                {
                    name: 'Engineering & Computing',
                    schools: [
                        'School of Computing and Information Sciences',
                        'OHL School of Construction',
                        'Department of Biomedical Engineering',
                        'Department of Civil and Environment Engineering',
                        'Department of Electrical and Computer Engineering',
                        'Department of Mechanical and Materials Engineering'
                    ]
                },
                {
                    name: 'Herbert Wertheim College of Medicine',
                    schools: [
                        'Cellular Biology and Pharmacology',
                        'Human and Molecular Genetics',
                        'Immunology',
                        'Medical and Population Health Sciences Research'
                    ]
                },
                {
                    name: 'Honors College',
                    schools: []
                },
                {
                    name: 'Journalism and Mass Communication',
                    schools: [
                        'Advertising and Public Relations',
                        'Journalism Broadcasting and Digital Media'
                    ]
                },
                {
                    name: 'Law',
                    schools: [
                        'College of Law'
                    ]
                },
                {
                    name: 'Nicole Wertheim College of Nursing & Health Sciences',
                    schools: [
                        'Biostatistics',
                        'Dietetics and Nutrition',
                        'Environmental and Occupational Health',
                        'Epidemiology',
                        'Health Policy and Management',
                        'Health Promotion and Disease Prevention'
                    ]
                },
                {
                    name: 'Robert Stempel College of Public Health & Social Work',
                    schools: [
                        'School of Social Work'
                    ]
                },
                {
                    name: 'Steven J. Green School of International and Public Affairs',
                    schools: [
                        'Criminal Justice',
                        'Economics',
                        'Global and Sociocultural Studies',
                        'History',
                        'Modern Languages',
                        'Public Administration',
                        'Religious Studies'
                    ]
                }
            ];

            $scope.fixedColleges = $scope.colleges;

            for (school in $scope.fixedColleges) {
                var name = $scope.fixedColleges[school]['name']
                var fixedNames = name.split(' ').join('_');
                fixedNames = fixedNames.split('&').join('and');
                ////console.log(fixedNames);
                $scope.fixedColleges[school]['name'] = fixedNames;
            }
            ;


            vm.title = "";
            vm.image = "";
            vm.terms;
            vm.description = null;
            vm.disciplines = [];
            vm.editingMode = false;
            //Joe Use Story
            vm.semester = null;
            //$scope.project.submit = submit;
			// Us 1328
			vm.projectTitleOrig;
			vm.projectTitleNew;

            var faculty;
            $scope.updateFacultyEmails = updateFacultyEmails;
            $scope.updateFacultyNames = updateFacultyNames;
            $scope.updateMentorEmails = updateMentorEmails;
            $scope.updateMentorNames = updateMentorNames;
            $scope.updateStudentNames = updateStudentNames;
            $scope.updateStudentEmails = updateStudentEmails;
            $scope.populatePrevious = populatePrevious;
            $scope.addVideoToProject = addVideoToProject;
            $scope.removeVideoFromProject = removeVideoFromProject;
            $scope.addDocToProject = addDocToProject;
            $scope.removeDocFromProject = removeDocFromProject;
            $scope.addDeliverableToProject = addDeliverableToProject;
            $scope.removeDeliverableFromProject = removeDeliverableFromProject;

            init();
            function init() {
                if ($stateParams.id != null) {
                    vm.id = $stateParams.id;
                    vm.editingMode = true;
                    //console.log("Project Editing is " + vm.editingMode);
                    getProjectById();
                    //getProjects()
                }

                loadTerms();
            }

            var old_project = null;

            function populatePrevious(){
               console.log($scope)
               console.log($scope.project)
               console.log($scope.previousProj)
               console.log($scope.project.previousProj)
               ProjectService.getProject($scope.project.previousProj).then((data)=>{
                  console.log(data)
                  $scope.project.title = data.title
                  $scope.project.description = data.description
                  $scope.project.firstSemester = data.firstSemester
                  $scope.project.maxStudents = data.maxStudents
                  $scope.project.video_url = data.video_url
                  $scope.project.youtube_url = data.youtube_url
                  $scope.project.attachments = data.attachments
                  $scope.project.deliverables_attached = data.deliverables_attached
                  $scope.project.reqskillItem = data.reqskillItem

               })
            }
            function getPreviousProjects(){
               console.log(vm.adminEmail)
               ProjectService.getPreviousProjects(vm.adminEmail).then((projects)=>{
                  console.log(projects);
                  $scope.project.previous = projects
               });
            }
            function getProjectById() {
                ProjectService.getProject(vm.id).then(function (data) {
                    $scope.project = data;
					vm.projectTitleOrig = $scope.project.title;
                    old_project = JSON.parse(JSON.stringify(data)); // Make a new reference to avoid a circular reference.
                    $scope.SelectedFacultyNames = "";
                    $scope.SelectedMentorNames = "";
                    $scope.SelectedStudentNames = "";
                    $scope.SelectedFacultyEmails = "";
                    $scope.SelectedMentorEmails = "";
                    $scope.SelectedStudentEmails = "";
                    //updating semester snaku001
                    $scope.project.semesters = ['Spring 2017', 'Summer 2017', 'Fall 2017'];
                    for (i = 0; i < $scope.project.faculty.length; i++) {
                        if (i != $scope.project.faculty.length - 1) {
                            $scope.SelectedFacultyNames += $scope.project.faculty[i].name + ", ";
                            $scope.SelectedFacultyEmails += $scope.project.faculty[i].email + ", ";
                        }
                        else {
                            $scope.SelectedFacultyNames += $scope.project.faculty[i].name;
                            $scope.SelectedFacultyEmails += $scope.project.faculty[i].email;
                        }
                    }
                    for (i = 0; i < $scope.project.mentor.length; i++) {
                        if (i != $scope.project.mentor.length - 1) {
                            $scope.SelectedMentorNames += $scope.project.mentor[i].name + ", ";
                            $scope.SelectedMentorEmails += $scope.project.mentor[i].email + ", ";
                        }
                        else {
                            $scope.SelectedMentorNames += $scope.project.mentor[i].name;
                            $scope.SelectedMentorEmails += $scope.project.mentor[i].email;
                        }
                    }
                    for (i = 0; i < $scope.project.members_detailed.length; i++) {
                        if (i != $scope.project.members_detailed.length - 1) {
                            $scope.SelectedStudentNames += $scope.project.members_detailed[i] + ", ";
                            $scope.SelectedStudentEmails += $scope.project.members[i] + ", ";
                        }
                        else {
                            $scope.SelectedStudentNames += $scope.project.members_detailed[i];
                            $scope.SelectedStudentEmails += $scope.project.members[i];
                        }
                    }

                });
            }

// User Story #1175
            function checkrequired() {
                if (($scope.project.description != null)) {
                    return 1;
                }
                return 0;
            }

            //Joe's User Story
            function loadTerms() {
                reviewStudentAppService.loadTerms().then(function (data) {
                    console.log("in loadTerms()");
                    $scope.terms = data;
                    vm.terms = data;
                    console.log(vm.terms);
                });
            }

            $scope.save = function save() {
                SkillsService.saveSkills($scope.project.reqskillItem.split(',')
                    .map(function(skill) { return skill.trim(); })
                    .filter(function(skill) { return skill !== "" }));

                //Joe's Use Story
                var SelectedTerm = $scope.project.semester;
                var SelectedStatus;
                //console.log(SelectedTerm);
                for (i = 0; i < vm.terms.length; i++) {
                    if (SelectedTerm == vm.terms[i].name) {
                        //console.log(SelectedTerm);
                        //console.log(vm.terms[i].name);
                        console.log(vm.terms[i].status);
                        SelectedStatus = vm.terms[i].status;
                    }

                }
                console.log(SelectedStatus);
                if (SelectedStatus == "Disabled") {

                    swal({
                        title: "Dear Proposer!",
                        text: "This Semester is no longer active, please propose your project for an active semester",
                        type: "info",
                        confirmButtonText: "Okay",
                        showCancelButton: true,
                    }, function () {
                        //alert(1);
                        $window.location.href = "/#/vip-project-proposal";
                    });
                    return;
                } else {

                    //Use Story #1207
                    $scope.project.proposedDate = DateTimeService.getCurrentDateTimeAsString();


// User Story #1175
                    if (!checkrequired()) {
                        FacultyMissingFields();
                        return;
                    }

                    updateFaculty();
                    updateMentor();
                    updateStudent();
                    updateVideo();
                    updateDocs();
                    updateDeliverables();


                    if (!$scope.project.owner_name && !$scope.project.owner_email) {
                        $scope.project.owner = profile._id;
                        $scope.project.owner_name = profile.firstName + " " + profile.lastName;
                        $scope.project.owner_email = profile.email;
                    }
                    else {
                        $scope.project.owner = "";
                    }


                    // $scope.project.video_url = ProcessVideoURL($scope.project.video_url);

                    // var videoThumbnailURL = createThumbURL($scope.project.video_url);

                    if (uploadProposalClass.image)
                        $scope.project.image = uploadProposalClass.image;

                    else
                        $scope.project.image = "https://www.woojr.com/wp-content/uploads/2009/04/" + $scope.project.title.toLowerCase()[0] + ".gif";

					vm.projectTitleNew = $scope.project.title;

                    if (!vm.editingMode) {

                        $scope.project.status = 'pending';
                        ProjectService.createProject($scope.project)
                            .then(function (data) {
                                success_msg();

                                var todo = {
                                    owner: profile.userType,
                                    owner_id: profile._id,
                                    todo: profile.firstName + ", thank you for submitting project proposal titled " + $scope.project.title + ". Currently the project is pending approval wait till PI approves and you will recieve another notification here with the status. If you have any question contact the PI.",
                                    type: "project",
                                    link: "/#/to-do"
                                };
                                ToDoService.createTodo(todo).then(function (success) {

                                }, function (error) {

                                });
                                var todo2 = {
                                    owner: "Pi/CoPi",
                                    todo: "Dear PI, " + profile.firstName + " " + profile.lastName + " has proposed a project titled: " + $scope.project.title + ", please approve or deny the project as it requires your approval.",
                                    type: "project",
                                    link: "/#/reviewproject"
                                };
                                ToDoService.createTodo(todo2).then(function (success) {

                                }, function (error) {

                                });

                                var email_msg =
                                    {
                                        recipient: profile.email,
                                        text: "Thank you for proposing " + $scope.project.title + " your proposed project is currently pending and this is just a confirmation that you proposed the project please keep checking the VIP to-do or your email as the PI will approve or deny the project you have just proposed.<br/><br/>Project:" + $scope.project.title + "<br/>Status: Pending",
                                        subject: "Project Proposal Submission Pending",
                                        recipient2: vm.adminEmail,
                                        text2: profile.firstName + " " + profile.lastName + " has proposed a project titled: " + $scope.project.title + ", please approve or deny the project as it requires your approval. Approve Projects Here: " + LocationService.vipWebUrls.reviewProject,
                                        subject2: "Faculty Has Proposed New Project: " + $scope.project.title
                                    };
                                User.nodeEmail(email_msg);
                            }, function (error) {
                                $scope.result = "An Error Occured Whilst Submitting Project Proposal! REASON: " + error.data;
                            });
                    }
                    else {
                        vm.semesters = ['Spring 2017', 'Summer 2017', 'Fall 2017'];
                        if (old_project) {
                            $scope.project.old_project = old_project;
                        }
                        $scope.project.status = 'modified';
                        //console.log("req_video_url modified " + $scope.project.video_url);
                        //console.log("req_attachments modified " + $scope.project.attachments);

                        // if user has uploaded a new image, 'image' var will be non-null, so update image via API
                        if (uploadProposalClass.image)
                            $scope.project.image = uploadProposalClass.image;

                        // user hasnt uploaded a new image, set 'image' val to "", so API can know not to change it
                        else
                            $scope.project.image = "";

                        $scope.project.id = $stateParams.id;
                        $scope.project.edited = true;
                        ProjectService.editProject($scope.project, $stateParams.id)
                            .then(function (data) {
                                success_msg();
                                var todo = {
                                    owner: profile.userType,
                                    owner_id: profile._id,
                                    todo: profile.firstName + ", thank you for editing the project proposal titled " + $scope.project.title + ". Your changes are currently under review. You will be notified as soon as a decision to approve/deny them has been made. If you have any questions, please contact the PI.",
                                    type: "project",
                                    link: "/#/to-do"
                                };
                                ToDoService.createTodo(todo).then(function (success) {

                                }, function (error) {

                                });
                                var todo2 = {
                                    owner: "Pi/CoPi",
                                    todo: "Dear PI, " + profile.firstName + " " + profile.lastName + " has edited an existing project titled: " + $scope.project.title + ", please approve or deny the changes that were made.",
                                    type: "project",
                                    link: "/#/reviewproject"
                                };
                                ToDoService.createTodo(todo2).then(function (success) {

                                }, function (error) {

                                });

                                // email should indicate that the project has been modified, not that it's a new proposal
                                var email_msg =
                                    {
                                        recipient: profile.email,
                                        text: "Please be patient while the edits that you have proposed for the project " + $scope.project.title + " are reviewed. Once a decision has been made to approve/reject your edits, you will be notified again via email.<br/><br/>Project:" + $scope.project.title + "<br/>Status: Modified-PendingReview",
                                        subject: "Proposed Edits for " + $scope.project.title + " are being Reviewed",
                                        recipient2: vm.adminEmail,
                                        subject2: "Faculty Has Edited the Existing Project " + $scope.project.title,
                                        text2: profile.firstName + " " + profile.lastName + " has edited the existing project " + $scope.project.title + ". Please review the edits to the project, and approve/deny the project by visiting the following link - " + LocationService.vipWebUrls.reviewProject
                                    };

                                User.nodeEmail(email_msg);

								// US 1328 - Update users who are currently associated with proposed project
								var allusers;
								User.loadAllUsers().then(function (data) {
									allusers = data;
									allusers.forEach(function (user, index) {
										if (user.project == vm.projectTitleOrig) {
											user.project = vm.projectTitleNew;
											User.update({user: user});
										}
									});
								});

                            }, function (error) {
                                $scope.result = "An Error Occured Whilst Submitting Project Proposal!";
                            });
                    }

                }
            };

            $scope.toggleCheckbox = function toggleSelection(majors) {
                var idx = vm.disciplines.indexOf(majors);

                // is currently selected
                if (idx > -1) {
                    vm.disciplines.splice(idx, 1);
                }

                // is newly selected
                else {
                    vm.disciplines.push(majors);
                }
            };

            function loading() {
                swal({
                        title: '',
                        text: 'Loading Please Wait...',
                        html: true,
                        timer: 10000,
                        showConfirmButton: false
                    }
                );
            }

// User Story #1175
            function FacultyMissingFields() {
                swal({
                        title: 'Almost There!',
                        text: 'Please Enter the Description of your Project.',
                        html: true,
                        timer: 10000,
                        showConfirmButton: true
                    }
                );
            }

            function error_msg() {
                swal({
                        title: "Oops!",
                        text: "An uknown error has occured!",
                        type: "warning",
                        confirmButtonText: "Ok",
                        allowOutsideClick: true,
                        timer: 7000,
                    }, function () {
                        $window.location.reload();
                    }
                );
            };

            function success_msg() {
                swal({
                        title: "Project Proposed!",
                        text: "Thank you for submitting your wonderful idea. A PI/Co-PI will now review it and notify you if it is accepted",
                        type: "success",
                        confirmButtonText: "Continue",
                        allowOutsideClick: true,
                        timer: 9000,
                    }, function () {
                        $window.location.reload();
                    }
                );
            };

            var facultyname;
            var facultyemail;

            function updateFacultyNames(nameList) {
                if (nameList) {
                    var names = nameList.split(', ');
                    console.log(names);
                    var temp = [];
                    names.forEach(function (obj) {
                        temp.push(obj);
                    });
                    facultyname = temp;
                }
                else {
                    facultyname = null;
                }

            }


            function updateFacultyEmails(emailList) {
                if (emailList) {
                    var emails = emailList.split(', ');
                    console.log(emails);
                    var temp = [];
                    emails.forEach(function (obj) {
                        temp.push(obj);
                    });
                    facultyemail = temp;
                }
                else {
                    facultyemail = null;
                }
            }

            function updateFaculty() {
                if (facultyname && facultyemail) {
                    $scope.project.faculty = [];
                    for (var i = 0; i < facultyname.length; i++) {
                        if ($scope.project.faculty) {
                            $scope.project.faculty.push({name: facultyname[i], email: facultyemail[i]});
                        }
                        else {
                            $scope.project.faculty = [{name: facultyname[i], email: facultyemail[i]}];
                        }
                    }
                }
                else {
                    $scope.project.faculty = [];
                }
            }

            var mentorname;
            var mentoremail;

            function updateMentorNames(nameList) {
                if (nameList) {
                    var names = nameList.split(', ');
                    console.log(names);
                    var temp = [];
                    names.forEach(function (obj) {
                        temp.push(obj);
                    });
                    mentorname = temp;
                }
                else {
                    mentorname = null;
                }
            }


            function updateMentorEmails(emailList) {
                if (emailList) {
                    var emails = emailList.split(', ');
                    console.log(emails);
                    var temp = [];
                    emails.forEach(function (obj) {
                        temp.push(obj);
                    });
                    mentoremail = temp;
                }
                else {
                    mentoremail = null;
                }
            }

            function updateMentor() {
                if (mentorname && mentoremail) {
                    $scope.project.mentor = [];
                    for (var i = 0; i < mentorname.length; i++) {
                        if ($scope.project.mentor) {
                            $scope.project.mentor.push({name: mentorname[i], email: mentoremail[i]});
                        }
                        else {
                            $scope.project.mentor = [{name: mentorname[i], email: mentoremail[i]}];
                        }
                    }
                }
                else {
                    $scope.project.mentor = [];
                }
            }


            var studentname;
            var studentemail;

            function updateStudentNames(nameList) {
                if (nameList) {
                    var names = nameList.split(', ');
                    console.log(names);
                    var temp = [];
                    names.forEach(function (obj) {
                        temp.push(obj);
                    });
                    studentname = temp;
                }
                else {
                    studentname = null;
                }
            }

            function updateStudentEmails(emailList) {
                if (emailList) {
                    var emails = emailList.split(', ');
                    console.log(emails);
                    var temp = [];
                    emails.forEach(function (obj) {
                        temp.push(obj);
                    });
                    studentemail = temp;
                }
                else {
                    studentemail = null;
                }
            }

            function updateStudent() {
                if (studentname && studentemail) {
                    $scope.project.members = [];
                    $scope.project.members_detailed = [];
                    for (var i = 0; i < studentname.length; i++) {
                        if ($scope.project.addedStudents) {
                            //$scope.project.addedStudents.push({name: studentname[i], email: studentemail[i]});
                            $scope.project.members.push(studentemail[i]);
                            $scope.project.members_detailed.push(studentname[i]);
                        }
                        else {
                            $scope.project.members = studentemail[i];
                            $scope.project.members_detailed = studentname[i];
                        }
                    }
                }
                else {
                    $scope.project.members = [];
                    $scope.project.members_detailed = [];
                }
            }

            var projectVideos;

            function addVideoToProject() {
                //console.log("Add Video button pressed. Inside Function...");
                if ($scope.project.videoAdd) {
                    //console.log("Video Field not empty!");
                    var addVideo = $scope.project.videoAdd;
                    //console.log("Original URL in field is: " + addVideo);
                    var processedVidUrl = ProcessVideoURL(addVideo);
                    //console.log("New URL is: " + processedVidUrl);
                    var processedVidThumb = createThumbURL(processedVidUrl);
                    //console.log("Thumbnail URL is: " + processedVidThumb);
                    var found = false;
                    if(projectVideos == null && vm.editingMode == false) {
                        //console.log("Video array is undefined. It must be a new project.");
                        projectVideos = []
                        $scope.project.video_url = [];
                    }
                    else if (vm.editingMode == true) {
                        //console.log("Existing Project is being modified");
                        projectVideos = $scope.project.video_url;
                    }
                    for (i = 0; i < $scope.project.video_url.length; i++) {
                        //console.log("Inside For loop");
                        if ($scope.project.video_url[i].vidurl == processedVidUrl) {
                            //console.log("Video already in project");
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        //console.log("Video will be added to project and saved when submit is pressed.");
                        projectVideos.push({vidurl: processedVidUrl, vimgurl: processedVidThumb});
                        if (vm.editingMode == false) {
                            $scope.project.video_url.push({vidurl: processedVidUrl, vimgurl: processedVidThumb});
                        }
                    }
                }
                $scope.project.videoAdd = null;
            }

            function removeVideoFromProject(removeVid) {
                for (i = 0; i < $scope.project.video_url.length; i++) {
                    //console.log("Inside Remove For loop");
                    if (vm.editingMode == false) {
                        if ($scope.project.video_url[i] == removeVid) {
                            if (projectVideos){
                                //console.log("PROJECT VIDEOS IS NOT EMPTY! Removing");
                                projectVideos.splice(i, 1);
                            }
                            //console.log("Project Videos is empty because nothing new has been added. Removing");
                            $scope.project.video_url.splice(i, 1);
                        }
                    }
                    else {
                        if ($scope.project.video_url[i] == removeVid) {
                            if (projectVideos){
                                //console.log("PROJECT VIDEOS IS NOT EMPTY! Removing");
                                projectVideos.splice(i, 1);
                            }
                            else {
                                //console.log("Project Videos is empty because nothing new has been added. Removing");
                                $scope.project.video_url.splice(i, 1);
                            }
                        }
                    }
                }
            }

            function updateVideo() {
                //console.log("Saving Videos. Inside Function...");
                if (projectVideos) {
                    //console.log("Videos to save not empty!");
                    $scope.project.video_url = [];
                    for (var i = 0; i < projectVideos.length; i++) {
                        var insertedURL = projectVideos[i].vidurl;
                        var insertedThumbnail = projectVideos[i].vimgurl;
                        //console.log("Video saving! URL: " + insertedURL + " Image URL: " + insertedThumbnail);
                        $scope.project.video_url.push({vidurl: insertedURL, vimgurl: insertedThumbnail});
                    }
                }
            }

            //function updateProjectMembers()
            //{
            //	if($scope.project.owner_name && $scope.project.owner_email)
            //	{
            //		$scope.project.members = profile._id;
            //		$scope.project.owner_email = profile.email;
            //		$scope.project.owner_rank = profile.userType;
            //		$scope.project.owner_name = profile.firstName + " " + profile.lastName;
            //	}
            //}

            function ProcessVideoURL(VideoURL) {
                // format the youtube videos correctly
                // input: https://www.youtube.com/watch?v=uQ_DHRI-Xp0
                // output: https://www.youtube.com/embed/uQ_DHRI-Xp0
                if (VideoURL) {
                    // video is already embed format, return
                    if (VideoURL.indexOf("youtube.com/embed/") > -1) {
                        return VideoURL;
                    }

                    else if (VideoURL.indexOf("&list=") > -1) {
                        //console.log("PLAYLIST!!!!!");
                        videoID = VideoURL.substr(VideoURL.indexOf("list=") + 5);
                        updatedVideoURL = "https://www.youtube.com/embed/?listType=playlist&list=" + videoID;
                        //console.log("Filtered url: " + updatedVideoURL);
                        return updatedVideoURL;
                    }

                    // youtube.com universal filter
                    else if (VideoURL.indexOf("youtube.com") > -1) {
                        videoID = VideoURL.substr(VideoURL.indexOf("?v=") + 3);
                        updatedVideoURL = "https://www.youtube.com/embed/" + videoID;
                        //console.log("Filtered url: " + updatedVideoURL);
                        return updatedVideoURL;
                    }

                    // youtu.be filter
                    else if (VideoURL.indexOf("youtu.be") > -1) {
                        videoID = VideoURL.substr(VideoURL.indexOf(".be/") + 4);
                        updatedVideoURL = "https://www.youtube.com/embed/" + videoID;
                        //console.log("Filtered url: " + updatedVideoURL);
                        return updatedVideoURL;
                    }

                    else {
                        return VideoURL;
                    }
                }
                else {
                    return "";
                }
            }

            function createThumbURL(VideoURL) {
                if (VideoURL.indexOf("&list=") > -1) {
                    //console.log("Playlist Thumbnail")
                    videoID = VideoURL.substr(VideoURL.indexOf("list=") + 5);
                    createdThumbURL = "img/playlist.png";
                    //console.log("Filtered url: " + updatedVideoURL);
                    return createdThumbURL;
                }
                else {
                    videoID = VideoURL.substr(VideoURL.indexOf("embed/") + 6);
                    createdThumbURL = "https://img.youtube.com/vi/" + videoID + "/0.jpg";
                    return createdThumbURL;
                }
            }

            var projectDocs;

            function addDocToProject() {
                if (uploadProposalClass.docuUpload && !$scope.project.docLink) {
                    //console.log("Inside If Branch - doc upload field used");
                    var addDoc = uploadProposalClass.docuUpload;
                    var addDocTitle = $scope.project.docTitle;
                    var found = false;
                    if (projectDocs == null && vm.editingMode == false) {
                        projectDocs = [];
                        $scope.project.attachments = [];
                    }
                    else {
                        projectDocs = $scope.project.attachments;
                    }
                    for (i = 0; i < $scope.project.attachments.length; i++) {
                        //console.log("Inside For loop");
                        if ($scope.project.attachments[i].url == addDoc) {
                            //console.log("Doc already in project");
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        //console.log("Doc will be added to project and saved when submit is pressed.");
                        projectDocs.push({name: addDocTitle, url: addDoc});
                        if (vm.editingMode == false) {
                            $scope.project.attachments.push({name: addDocTitle, url: addDoc});
                        }
                    }
                }
                else if (!uploadProposalClass.docuUpload && $scope.project.docLink) {
                    //console.log("Inside Else Branch - link field used");
                    var addDoc = $scope.project.docLink;
                    var addDocTitle = $scope.project.docTitle;
                    var found = false;
                    if (projectDocs == null && vm.editingMode == false) {
                        projectDocs = [];
                        $scope.project.attachments = [];
                    }
                    else if (projectDocs == null) {
                        projectDocs = $scope.project.attachments;
                    }
                    for (i = 0; i < $scope.project.attachments.length; i++) {
                        //console.log("Inside For loop");
                        if ($scope.project.attachments[i].url == addDoc) {
                            //console.log("Doc already in project");
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        //console.log("Doc will be added to project and saved when submit is pressed.");
                        projectDocs.push({name: addDocTitle, url: addDoc});
                        if (vm.editingMode == false) {
                            $scope.project.attachments.push({name: addDocTitle, url: addDoc});
                        }
                    }
                }
                uploadProposalClass.docuUpload = null;
                $scope.project.docLink = null;
                $scope.project.docTitle = null;
            }

            function removeDocFromProject(removeDoc) {
                for (i = 0; i < $scope.project.attachments.length; i++) {
                    //console.log("Inside Remove For loop");
                    if (vm.editingMode == false) {
                        if ($scope.project.attachments[i] == removeDoc) {
                            //console.log("Inside Remove if statement");
                            if (projectDocs){
                                //console.log("Removing Doc");
                                projectDocs.splice(i, 1);
                            }
                            //console.log("Removing Doc...will remove on save");
                            $scope.project.attachments.splice(i, 1);
                        }
                    }
                    else {
                        if ($scope.project.attachments[i] == removeDoc) {
                            //console.log("Inside Remove if statement");
                            if (projectDocs){
                                //console.log("Removing Doc");
                                projectDocs.splice(i, 1);
                            }
                            else {
                                //console.log("Removing Doc...will remove on save");
                                $scope.project.attachments.splice(i, 1);
                            }
                        }
                    }
                }
            }

            function updateDocs() {
               // console.log("Saving Docs. Inside Function...");
                if (projectDocs) {
                    //console.log("Docs to save not empty!");
                    $scope.project.attachments = [];
                    //console.log("Items in Permanant Array BEFORE Update AFTER clear: %O ", $scope.project.attachments);
                    //console.log("Items in Array for Update: %O ", projectDocs);
                    for (var i = 0; i < projectDocs.length; i++) {
                        //console.log("Inside Update For Loop");
                        var insertedDocName = projectDocs[i].name;
                        var insertedDocURL = projectDocs[i].url;
                        //console.log("Docs saving! Name: " + insertedDocName + " URL: " + insertedDocURL);
                        $scope.project.attachments.push({name: insertedDocName, url: insertedDocURL});
                    }
                }
            }

            var projectDeliverables;

            function addDeliverableToProject() {
                if (uploadProposalClass.deliverableUpload) {
                    //console.log("Inside If Branch - doc upload field used");
                    var addDeliverable = uploadProposalClass.deliverableUpload;
                    var addDeliverableTitle = $scope.project.deliverableTitle;
                    var found = false;
                    if (projectDeliverables == null && vm.editingMode == false) {
                        projectDeliverables = [];
                        $scope.project.deliverables_attached = [];
                    }
                    else {
                        projectDeliverables = $scope.project.deliverables_attached;
                    }
                    for (i = 0; i < $scope.project.deliverables_attached.length; i++) {
                        //console.log("Inside For loop");
                        if ($scope.project.deliverables_attached[i].url == addDeliverable) {
                            //console.log("Doc already in project");
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        //console.log("Doc will be added to project and saved when submit is pressed.");
                        projectDeliverables.push({name: addDeliverableTitle, url: addDeliverable});
                        if (vm.editingMode == false) {
                            $scope.project.deliverables_attached.push({name: addDeliverableTitle, url: addDeliverable});
                        }
                    }
                }
                uploadProposalClass.deliverUpload = null;
                $scope.project.deliverableTitle = null;
            }

            function removeDeliverableFromProject(removeDeliverable) {
                for (i = 0; i < $scope.project.deliverables_attached.length; i++) {
                    //console.log("Inside Remove For loop");
                    if (vm.editingMode == false) {
                        if ($scope.project.deliverables_attached[i] == removeDeliverable) {
                            //console.log("Inside Remove if statement");
                            if (projectDeliverables){
                                //console.log("Removing Doc");
                                projectDeliverables.splice(i, 1);
                            }
                            //console.log("Removing Doc...will remove on save");
                            $scope.project.deliverables_attached.splice(i, 1);
                        }
                    }
                    else {
                        if ($scope.project.deliverables_attached[i] == removeDeliverable) {
                            //console.log("Inside Remove if statement");
                            if (projectDeliverables){
                                //console.log("Removing Doc");
                                projectDeliverables.splice(i, 1);
                            }
                            else {
                                //console.log("Removing Doc...will remove on save");
                                $scope.project.deliverables_attached.splice(i, 1);
                            }
                        }
                    }
                }
            }

            function updateDeliverables() {
                // console.log("Saving Docs. Inside Function...");
                if (projectDeliverables) {
                    //console.log("Docs to save not empty!");
                    $scope.project.deliverables_attached = [];
                    //console.log("Items in Permanant Array BEFORE Update AFTER clear: %O ", $scope.project.deliverables_attached);
                    //console.log("Items in Array for Update: %O ", projectDeliverables);
                    for (var i = 0; i < projectDeliverables.length; i++) {
                        //console.log("Inside Update For Loop");
                        var insertedDeliverableName = projectDeliverables[i].name;
                        var insertedDeliverableURL = projectDeliverables[i].url;
                        $scope.project.deliverables_attached.push({name: insertedDeliverableName, url: insertedDeliverableURL});
                    }
                }
            }

        });
}());
