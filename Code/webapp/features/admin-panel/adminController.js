(function () {
    'use strict';

    angular
        .module('admin')
        .controller('adminController', adminCtrl);

    function adminCtrl($location, $window, $state, $scope, adminService, User, reviewStudentAppService, ProfileService, reviewRegService, reviewProfileService, ProjectService) {
        var vm = this;

        ProfileService.loadProfile().then(function (data) {
            if (data) {
                $scope.done = true;
                var profile = data;
                if (profile.userType != "Pi/CoPi") {
                    //$location.path("/");
                    $location.path('/').replace();
                }
            }
            else {
                $scope.done = true;
                $window.sessionStorage.setItem('lr', 'adminpanel');
                $location.path('login').replace();
            }
        });

        vm.users; //Confirmed users only (Email is verified)
        vm.allusers; //All confirmed and unconfirmed users
        vm.unconfirmedusers;//Unconfirmed users (Email is not verified)
        vm.filteredusers; //filteredusers affected by filter function
        vm.projects;
        vm.terms;
        vm.filterUsers = filterUsers;
        vm.currentuserview;
        vm.currentview = currentview;
        vm.deleteUser = RemoveUser;
        vm.changeUserType = changeUserType;
        vm.ConfirmUser = ConfirmUser;
        vm.RejectUser = RejectUser;
        vm.seed = seed;
        //userstory #1172
        vm.exportData = exportData;
        vm.tabledata = null;

        //Out of scope functions
        vm.userTypeChange = userTypeChange;
        vm.userChange = userChange;
        vm.userinUnconfirmedfunc = userinUnconfirmedfunc;

        //For out of scope variables:
        vm.userinusertype;
        vm.userinprojects;
        vm.usertypeinusertype;
        vm.projectinprojects;
        vm.userinunconfirmed;
        vm.AddTerms = AddTerms;


        vm.currentUser = function (user) {
            vm.cuser = user;
        }
        vm.currentProject = function (project) {
            vm.cproject = project;
        }
        vm.currentTerm = function (term) {
            vm.cterm = term;
        }
        vm.sw = ChangeUserProject;
        vm.sc = ClearProject;

        //Joe's User Story
        vm.se = ChangeProjectStatus;
        vm.nw = ChangeTermStatus;

        vm.usertype = ['Staff/Faculty', 'Pi/CoPi', 'Student', 'Undefined'];
        //Joe's User Story
        vm.status = ['Active', 'Disabled'];
        vm.active = ['Active', 'Disabled'];
        vm.getProjectTitle = function (email) {
            if (email) {
                if (vm.projects) {
                    var results = vm.projects.filter(function (project) {
                        return project.members.includes(email)
                    });
                    if (results.length >= 1) {
                        return "Member of " + results[0].title + ".";
                    }
                    else {
                        return "Hasn't joined any project!";
                    }
                }
            }
        };

        vm.changeEmailSignature = function() {
            vm.savesetting();
        };

        vm.impersonate = function(user) {
            adminService.impersonate(user).then(function(data) {
                if (!data.redirectUrl) {//there was an error
                    swal({
                            title: 'Impersonation error.',
                            text: 'There was an error when attempting to impersonate user: ' + user.email + "\n" + data.message,
                            html: true,
                            timer: 10000,
                            showConfirmButton: true
                        }
                    );
                } else {
                    $window.location.href = data.redirectUrl;
                    $window.location.reload();
                }
            });
        };

        //Used for filters
        vm.getRank = getRank;
        vm.filteredrank; //Value changed by getRank function after a usertype is selected in filter
        vm.typeranks = [
            {
                name: 'Staff/Faculty',
                ranks: [
                    'Instructor',
                    'Assitant Professor',
                    'Associate Professor',
                    'Full Professor',
                    'Administrator',
                    'Director'

                ]
            },
            {
                name: 'Pi/CoPi',
                ranks: [
                    'PI',
                    'CoPI',
                    'Coordinator',
                    'External Member'
                ]
            },
            {
                name: 'Student',
                ranks: [
                    'Freshman',
                    'Sophmore',
                    'Junior',
                    'Senior',
                    'Masters',
                    'PhD',
                    'postDoc'
                ]
            },
            {
                name: 'Undefined',
                ranks: [
                    'Undefined'
                ]
            }
        ];

        function getRank(usertype) {
            if (usertype) {
                vm.typeranks.forEach(function (obj) {
                    if (obj.name == usertype.name) {
                        vm.filteredrank = obj.ranks;
                    }

                });
            }
        }

        //Ravi's Help
        function AddTerms() {
            var termsdata = {
                name: "Fall 2016",
                start: new Date('2016', '08'),
                end: new Date('2017', '12'),
                deadline: new Date('2017, 08'),
                active: true,
                status: "Active"
            };

            reviewStudentAppService.addterm(termsdata).then(function (success) {
            }, function (error) { });
        };

        vm.deleteemail = DeleteEmail;
        vm.addemail = AddEmail;
        vm.addsetting = AddSetting;
        vm.deletesetting = DeleteSetting;
        vm.savesetting = SaveSetting;
        vm.toggleactive = ToggleActive;
        vm.loadsettings = loadSettings;


        function ToggleActive(event)
        {
            if ($(event.target).val().length > 0) {

                $(".list-group .list-group-item").removeClass("active");
                $(event.target).toggleClass("active");

                vm.adminSettings.current_email = $(event.target).val();
            }
        }

        function DeleteEmail(which)
        {
            if (vm.adminSettings.emails.length > 1 )
            {
                var indexToRemove = vm.adminSettings.emails.indexOf(which);

                if (which === vm.adminSettings.current_email)
                {
                    if (indexToRemove == 0)
                        vm.adminSettings.current_email = vm.adminSettings.emails[indexToRemove + 1];
                    else
                        vm.adminSettings.current_email =
                            vm.adminSettings.emails[indexToRemove - 1];
                }

                vm.adminSettings.emails.splice(indexToRemove, 1);
            }
            else
                cannotdelete_msg();
        }
        function AddEmail()
        {
            if ($scope.newEmail != null)
            {
                vm.adminSettings.emails.push($scope.newEmail);
                $scope.newEmail = "";
            }
            else
                cannotadd_msg();
        }
        function DeleteSetting(setting)
        {
            adminService.deleteSettings(setting._id);
        }
        function AddSetting()
        {
            adminService.makeInitialSettings();
        }

        function SaveSetting()
        {
            if (vm.adminSettings.emailSignature) {
                vm.adminSettings.emailSignature = vm.adminSettings.emailSignature.replace(/\n/g, "<br/>");
            }
            adminService.saveAdminSettings(vm.adminSettings).then(function(data) {
                vm.adminSettings.emailSignature = vm.adminSettings.emailSignature.replace(/<br\/>/g, "\n");
            });
            savesettings_msg();
        }

        init();

        function init() {
            loadUsers();
            loadProjects();
            //Joe's User Story
            loadTerms();
            loadSettings();
        }

        vm.adminSettings;
        function loadSettings()
        {
            console.log("Loading settings...");

            adminService.getAdminSettings().then(function (data)
            {
                var result = data;

                var getAdminSettings = function() {
                    adminService.getAdminSettings().then(function (data) {
                        vm.adminSettings = data;
                        vm.adminSettings.emailSignature = vm.adminSettings.emailSignature.replace(/<br\/>/g, "\n");
                    });
                };

                if (result) {
                    getAdminSettings();
                } else {
                    console.log("Creating admin settings");
                    adminService.makeInitialSettings().then(function(response) {
                        getAdminSettings();
                    }, function(response) { });
                }
            });
        }

        //Load all user information
        function loadUsers() {
            var tempArray = [];
            var tempArray2 = [];
            adminService.loadAllUsers().then(function (data) {
                vm.allusers = data;
                vm.allusers.forEach(function (obj) {
                    tempArray2.push(obj);
                    if (obj.verifiedEmail == false) {
                        tempArray2.pop();
                        tempArray.push(obj);
                    }
                });
                vm.users = tempArray2;
                vm.unconfirmedusers = tempArray;
                vm.filteredusers = vm.allusers;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            });
        }

        //Loads all project information for active projects
        function loadProjects() {
            reviewStudentAppService.loadProjects().then(function (data) {
                vm.projects = data;
            });
        }

        //Joe's User Story
        function loadTerms() {
            reviewStudentAppService.loadTerms().then(function (data) {
                vm.terms = data;
                console.log(data);
            });
        }

        vm.uncheck = function () {

            for (var i = 1; i <= 16; i++) {
                $scope['query' + i] = '';
            }
            $scope.usertype = '';
            $scope.userrank = '';
            $scope.userproject = '';
            $scope.selectedusertype = '';
            $scope.selecteduserrank = '';
            $scope.SelectedProject = '';
            $scope.piApproval = '';
            $scope.google = '';
            $scope.mentor = '';
            $scope.multipleproject = '';


        }
        //Filters users based on parameters
        function filterUsers(usertype, userrank, unconfirmed, gmaillogin, mentor, multipleprojects, selectedusertype, selecteduserrank, SelectedProject, userproject) {
            vm.filteredusers = vm.allusers;
            // n^2
            if (SelectedProject && userproject) {
                //alert("not null SelectedProject");
                var studentsArray = [];

                vm.filteredusers.forEach(function (obj) {
                    SelectedProject.members.forEach(function (obj2) {
                        //alert(obj.email);
                        //alert(obj2);

                        // user is in project we selected
                        if (obj.email == obj2) {
                            studentsArray.push(obj);
                            //alert(obj.email);
                        }

                    });
                });

                vm.filteredusers = studentsArray;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            }
            if (usertype && selectedusertype) {
                usertype = selectedusertype.name;
                var tempArray = [];
                vm.filteredusers.forEach(function (obj) {
                    if (obj.userType == usertype) {
                        tempArray.push(obj);
                    }
                });
                vm.filteredusers = tempArray;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            }
            if (userrank && selecteduserrank) {
                userrank = selecteduserrank;
                var tempArray = [];
                vm.filteredusers.forEach(function (obj) {
                    if (obj.userRank == userrank) {
                        tempArray.push(obj);
                    }
                });
                vm.filteredusers = tempArray;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            }
            if (unconfirmed) {
                var tempArray = [];
                vm.filteredusers.forEach(function (obj) {
                    if (obj.piApproval == false) {
                        tempArray.push(obj);
                    }
                });
                vm.filteredusers = tempArray;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            }
            if (gmaillogin) {
                var tempArray = [];
                vm.filteredusers.forEach(function (obj) {
                    if (obj.google) {
                        tempArray.push(obj);
                    }
                });
                vm.filteredusers = tempArray;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            }
            if (mentor) // O(n^3) Very slow.
            {
                var tempArray = [];
                vm.filteredusers.forEach(function (obj) {
                    vm.projects.forEach(function (proj) {
                        var full = obj.firstName + " " + obj.lastName;
                        if (proj.owner_name == full && tempArray) {
                            var contains;
                            tempArray.forEach(function (temp) {
                                var full2 = temp.firstName + " " + temp.lastName;
                                if (full2 == full) {
                                    contains = true;
                                }
                            });
                            if (!contains) {
                                tempArray.push(obj);
                            }
                        }
                        else if (proj.owner_name == full) {
                            tempArray.push(obj);
                        }
                    });
                });
                vm.filteredusers = tempArray;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            }
            if (multipleprojects) // O(n^3) Very slow.
            {
                var tempArray = [];

                vm.filteredusers.forEach(function (obj) {
                    var counter = 0;
                    if (obj.joined_project == true) {
                        vm.projects.forEach(function (proj) {
                            proj.members.forEach(function (email) {
                                if (email == obj.email) {
                                    counter++;
                                    if (counter > 1) {
                                        if (tempArray) {
                                            var contains;
                                            tempArray.forEach(function (temp) {
                                                var full = obj.firstName + " " + obj.lastName;
                                                var full2 = temp.firstName + " " + temp.lastName;
                                                if (full2 == full) {
                                                    contains = true;
                                                }
                                            });
                                            if (!contains) {
                                                tempArray.push(obj);
                                            }
                                        }
                                        else {
                                            tempArray.push(obj);
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
                vm.filteredusers = tempArray;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            }

        }

        function currentview(user) {
            console.log(user);
            var projectTitle = "";
            var project_title = "project_title";
            vm.currentuserview = [];
            ProjectService.getProject(user.project).then(function (data) {
                if (data.kind == "ObjectId") {
                    user[project_title] = user.project;
                    vm.currentuserview.push(user);
                }
                else {
                    projectTitle = data.title;
                    user[project_title] = projectTitle;
                    vm.currentuserview.push(user);
                    console.log(user);
                }

            });

        }

        //Remove users
        function RemoveUser(user) {
            swal({
                title: "Final warning!",
                text: "You will not be able to redo this action",
                type: "warning",
                confirmButtonText: "Delete my account",
                showCancelButton: true
            }, function () {
                User.delete(user._id).then(function () {
                    delete_msg();
                });
            });
        }

        //Out of scope function for Confirm/Reject unconfirmed users
        function userinUnconfirmedfunc(user) {
            vm.userinunconfirmed = user;
        }

        //Confirm unconfirmed users
        function ConfirmUser() {
            if (vm.userinunconfirmed) {
                var user = vm.userinunconfirmed;
                user.piApproval = true;
                user.isDecisionMade = true;
                user.__v = 3;
                user.verifiedEmail = true;
                console.log("piApproval set to true");
                vm.message = "User has been Accepted!";

                // if a Pi is approved, mark him in the DB as a super user, so he can switch usertypes to student/faculty/pi without approval
                if (user.userType == "Pi/CoPi") {
                    user.isSuperUser = true;
                    console.log("isSuperUser set to true");
                }

                // non-pi user must be restricted
                else {
                    user.isSuperUser = false;
                    console.log("isSuperUser set to false");
                }

                reviewRegService.acceptProfile(user).then(function (data) {
                });
                confirm_msg();
            }
        }

        //Reject Unconfirmed users
        function RejectUser() {
            if (vm.userinunconfirmed) {
                var user = vm.userinunconfirmed;
                user.verifiedEmail = false;
                ProfileService.saveProfile(user).then(function (data) {
                    console.log("User reject");
                    Reject_msg();
                });
            }
        }

        function seed() {

            ProjectService.createTerm();
        }

        //Out of scope functions for Change User Type function
        function userTypeChange(usertype) {
            vm.usertypeinusertype = usertype;
        }

        function userChange(user) {
            vm.userinusertype = user;
        }

        //Change User Type
        function changeUserType() {
            if (vm.userinusertype || vm.usertypeinusertype) {
                var user = vm.userinusertype;
                user.userType = vm.usertypeinusertype;
                console.log("HELLO");
                user.modifying = true;
                ProfileService.saveProfile(user).then(function (data) {
                    reviewProfileService.updateProfile(user).then(function (data) {
                        console.log("UserType Changed");
                        changeut_msg();
                    });
                });
            }
        }

        //Updated code	//userstory #1172
//userstory #1172
        function exportData() {
            var date = new Date();
            var todays = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + "_";
            vm.alldata;
            var nArray = [];
            adminService.loadAllUsers().then(function (data) {
                vm.alldata = data;
                vm.alldata.forEach(function (obj) {
                    for (var j = 0; j < $scope.filteredItems.length; j++) {
                        if (obj.email == $scope.filteredItems[j].email)
                            nArray.push(obj);
                    }
                });
                var res = alasql("SELECT pantherID,firstName,lastName,email,project,semester,department,college,skillItem,vipcredit,volunteer,independentstudy,rank,userType,appliedDate,RegDate,firstlogin_date INTO XLSX('" + todays + "Report.xlsx',{headers:true}) FROM ? ", [nArray]);

            });
        }

        function confirm_msg() {
            swal({
                    title: "User Confirmed!",
                    text: "User's account has been confirmed!",
                    type: "info",
                    confirmButtonText: "Continue",
                    allowOutsideClick: true,
                    timer: 10000,
                }, function () {
                    $window.location.reload();
                }
            );
        };

        function Reject_msg() {
            swal({
                    title: "User Rejected!",
                    text: "User's account has been deleted!",
                    type: "info",
                    confirmButtonText: "Continue",
                    allowOutsideClick: true,
                    timer: 10000,
                }, function () {
                    $window.location.reload();
                }
            );
        };

        function delete_msg() {
            swal({
                    title: "User Deleted!",
                    text: "User's account has been deleted!",
                    type: "info",
                    confirmButtonText: "Continue",
                    allowOutsideClick: true,
                    timer: 10000,
                }, function () {
                    $window.location.reload();
                }
            );
        };


        function changeut_msg() {
            swal({
                    title: "Usertype Changed",
                    text: "User's type has been changed!",
                    type: "info",
                    confirmButtonText: "Continue",
                    allowOutsideClick: true,
                    timer: 10000,
                }, function () {

                }
            );
        };

        function changepro_msg() {
            swal({
                    title: "User's Project Changed",
                    text: "User's project has been changed!",
                    type: "info",
                    confirmButtonText: "Continue",
                    allowOutsideClick: true,
                    timer: 10000,
                }, function () {

                }
            );
        };
        function changestat_msg() {
            swal({
                    title: "Project Status Has Changed",
                    text: "Project's status has been changed!",
                    type: "info",
                    confirmButtonText: "Continue",
                    allowOutsideClick: true,
                    timer: 10000,
                }, function () {

                }
            );
        };
        function changeclear_msg() {
            swal({
                    title: "User's Project Cleared",
                    text: "User's project has been cleared!",
                    type: "info",
                    confirmButtonText: "Continue",
                    allowOutsideClick: true,
                    timer: 10000,
                }, function () {

                }
            );
        };

        function savesettings_msg()
        {
            swal({
                title: "Admin Settings Saved",
                text: "Admin preferences have been saved!",
                type: "info",
                confirmButtonText: "Continue",
                allowOutsideClick: true,
                timer: 10000,
        },
                function () {}
            );
        };

        function cannotadd_msg()
        {
            swal({
                    title: "Cannot Add Email",
                    text: "Input is not a valid email address!",
                    type: "warning",
                    confirmButtonText: "Continue",
                    allowOutsideClick: true,
                    timer: 10000,},
                function () {}
            );
        }
        function cannotdelete_msg()
        {
            swal({
                title: "Cannot Delete",
            text: "You cannot delete the last email!",
            type: "warning",
                confirmButtonText: "Continue",
            allowOutsideClick: true,
            timer: 10000,},
            function () {}
        );
        };

        //Change User's Project
        function ChangeUserProject() {
            var user = vm.cuser;
            var project = vm.cproject;
            if (user && project) {
                var formerProject;
                var name = user.firstName + " " + user.lastName;
                var email = user.email;
                for (i = 0; i < vm.projects.length; i++) {
                    if (vm.projects[i].members.includes(email)) {
                        formerProject = vm.projects[i];
                    }
                }
                project.members[project.members.length] = email;
                project.members_detailed[project.members_detailed.length] = name;
                ProjectService.editProject(project, project._id);
                if (formerProject) {
                    for (i = 0; i < formerProject.members_detailed.length; i++) {
                        if (formerProject.members_detailed[i] == name) {
                            formerProject.members_detailed.splice(i, 1);
                        }
                    }
                    for (i = 0; i < formerProject.members.length; i++) {
                        if (formerProject.members[i] == email) {
                            formerProject.members.splice(i, 1);
                        }
                    }
                    ProjectService.editProject(formerProject, formerProject._id);
                }
                changepro_msg();
            }
        };
        //Joe's User Story
        function ChangeProjectStatus() {
            //Get the project info based on the title being passed
            //Change status
            //Update DB
            var project = vm.cproject;
            var email;

            //console.log(project.title);
            if (project) {
                var selectedStatus = $scope.selectedStatus;
                //console.log(selectedStatus);
                if (selectedStatus == vm.status[0]) {
                    selectedStatus = 'Active';
                    //console.log(selectedStatus);
                } else {
                    selectedStatus = 'Disabled';
                    //console.log(selectedStatus);
                }
                project.status = selectedStatus;

                // User Story #1301
                if (project.status == 'Disabled') {
                    //console.log('Inside Dale Code');
                    for (i = 0; i < project.members.length; i++) {
                        //console.log('Inside Dale Code For loop');
                        email = project.members[i];
                        //console.log(email);
                        var email_msg =
                        {
                            recipient: email,
                            text: "Your current project has been disabled. For more information, please contact a PI.",
                            subject: "Project No Longer Available",
                            recipient2: vm.adminSettings.current_email,
                            text2: project.name + " has been successfully removed from project '" + (formerProject ? formerProject : 'unknown') + "'.",
                            subject2: "Project Deactivated"
                        };
                        User.nodeEmail(email_msg);
                    }
                }

                ProjectService.editProject(project, project._id);
                //console.log("In the Projects!");
            }
            changestat_msg();
        };
        //Joe's User Story
        function ChangeTermStatus() {
            var term = vm.cterm;

            var selectedTerm = $scope.selectedTerm.name;
            console.log(selectedTerm);
            //console.log(term.name);
            if (term) {
                var selectedTermStatus = $scope.selectedTermStatus;
                if (selectedTermStatus == vm.active[0]) {
                    console.log(selectedTermStatus);
                    selectedTermStatus = 'Active';
                } else {
                    selectedTermStatus = 'Disabled';
                }
                for (i = 0; i < vm.projects.length; i++) {
                    //console.log(vm.projects[i].title);
                    if (vm.projects[i].semester == selectedTerm) {
                        vm.projects[i].status = selectedTermStatus;
                        ProjectService.editProject(vm.projects[i], vm.projects[i]._id);
                    }
                }
                term.status = selectedTermStatus;
                ProjectService.editTerm(term, term._id);
            }
            changestat_msg();
        }

        //Remove a user from a project
        function ClearProject() {
            var user = vm.cuser;
            if (user) {
                var formerProject;
                var name = user.firstName + " " + user.lastName;
                var email = user.email;

                for (i = 0; i < vm.projects.length; i++) {
                    if (vm.projects[i].members.includes(email)) {
                        formerProject = vm.projects[i];
                    }
                }

                var email_msg =
                    {
                        recipient: email,
                        text: "Your current project has been cleared. For more information, please contact a PI.",
                        subject: "Project Cleared",
                        recipient2: vm.adminSettings.current_email,
                        text2: name + " has been successfully removed from project '" + (formerProject ? formerProject : 'unknown') + "'.",
                        subject2: "Removed user from project"
                    };
                User.nodeEmail(email_msg);

                if (formerProject) {
                    for (i = 0; i < formerProject.members_detailed.length; i++) {
                        if (formerProject.members_detailed[i] == name) {
                            formerProject.members_detailed.splice(i, 1);
                        }
                    }
                    for (i = 0; i < formerProject.members.length; i++) {
                        if (formerProject.members[i] == email) {
                            formerProject.members.splice(i, 1);
                        }
                    }
                    ProjectService.editProject(formerProject, formerProject._id);
                }
                changeclear_msg();
            }
        };

    }
})();