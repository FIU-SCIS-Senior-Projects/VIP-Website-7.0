(function () {
    'use strict';

    angular
        .module('admin',['ui.bootstrap','angularUtils.directives.dirPagination'])
        .controller('adminController', adminCtrl)
    function adminCtrl($location, $window, $state, $scope, adminService, User, reviewStudentAppService, ProfileService, reviewRegService, reviewProfileService, ProjectService, DateTimeService) {
        var vm = this;
        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        $scope.showUserMaint = false
        $scope.showSemesterMaint = false
        $scope.showProjectMaint = false
        $scope.showAdminPage = true
        $scope.routeUserMaint = routeUserMaint
        $scope.routeProjectMaintenance = routeProjectMaintenance
        $scope.routeSemesterMaintenance = routeSemesterMaintenance
        $scope.routeAdminMaint = routeAdminMaint
        vm.simulateQuery = false;
      vm.isDisabled    = false;

      // list of `state` value/display objects
      vm.querySearch   = querySearch;
      vm.selectedItemChange = selectedItemChange;
      vm.searchTextChange   = searchTextChange;
      function querySearch (query) {
      var results = query ? vm.filteredusers.filter( createFilterFor(query) ) : vm.filteredusers,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
  $log.info('Text changed to ' + text);
}

function selectedItemChange(item) {
  $log.info('Item changed to ' + JSON.stringify(item));
}
        function routeAdminMaint(){
           $scope.showUserMaint = false;
           $scope.showSemesterMaint = false;
           $scope.showProjectMaint = false;
           $scope.showAdminPage = true;
        }
        function routeUserMaint(){
           $scope.showUserMaint = true;
           $scope.showSemesterMaint = false;
           $scope.showProjectMaint = false;
           $scope.showAdminPage = false;
        }
        function routeProjectMaintenance(){
           $scope.showUserMaint = false;
           $scope.showSemesterMaint = false;
           $scope.showProjectMaint = true;
           $scope.showAdminPage = false;
        }
        function routeSemesterMaintenance(){
           $scope.showUserMaint = false;
           $scope.showSemesterMaint = true;
           $scope.showProjectMaint = false;
           $scope.showAdminPage = false;
        }
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
        vm.projects; //Projects that are active
        vm.terms;
        vm.filterUsers = filterUsers;
        vm.currentuserview;
        vm.currentview = currentview;
        vm.deleteUser = RemoveUser;
        vm.changeUserType = changeUserType;
        vm.ConfirmUser = ConfirmUser;
        vm.RejectUser = RejectUser;
        vm.seed = seed;
        // userstory #1172
        vm.exportData = exportData;
        vm.tabledata = null;
		// User story #1176
		vm.allprojects; //All projects
		vm.filteredprojects;
		vm.tabledata_p = null;
		// User story #1300
		vm.editingUser;
		vm.editingUserOrig;
		// Used for filtering of ranks in add and editing user modal
		vm.addRanks = [];
		vm.editRanks = [];
		// User story #1313
		vm.editingProject;
		vm.editingProjOrigMembers;
		// User story #1328
		vm.editingProjOrigTitle;
		vm.editingProjNewTitle;

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
        vm.selectUser = function(user){
           console.log(user)
           $scope.Selecteduserconfirm = user
        }

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

		vm.colleges = [
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

		function validateEmail(email) {
            return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(email)
		};
		
		function validatePassword(pwd) {
			if (pwd) {
				var array = [];
				array[0] = /[A-Z]/g.test(pwd);
				array[1] = /[a-z]/g.test(pwd);
				array[2] = /\d/g.test(pwd);
				array[3] = hasSpecialChars(pwd)

				var sum = 0;
				for (var i = 0; i < array.length; i++) {
					sum += array[i] ? 1 : 0;
				}

				return pwd.length >= 8 && sum == 4;
			}
			else
				return false;
		};
		
		function hasSpecialChars(string) {
			return (string.indexOf('!') != -1 ||
				string.indexOf('@') != -1 ||
				string.indexOf('#') != -1 ||
				string.indexOf('$') != -1 ||
				string.indexOf('%') != -1 ||
				string.indexOf('&') != -1 ||
				string.indexOf('*') != -1 ||
				string.indexOf('(') != -1 ||
				string.indexOf(')') != -1);
		};

		vm.genderOptions = [{type: 'Male'}, {type: 'Female'}];
		vm.booleanOptions = [{type: true}, {type: false}];

		// user story #1300
		vm.editUser = function(user) {
			vm.editingUser = user;
			vm.editingUserOrig = {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				project: user.project
			};

			// Set initial values of input to be current user values
			$scope.editUserFirstName = vm.editingUser.firstName;
			$scope.editUserLastName = vm.editingUser.lastName;
			$scope.editUserEmail = vm.editingUser.email;
			$scope.editUserPID = vm.editingUser.pantherID;

			// Search for indexes for references to user's values (if they exist)
			var indexes = {
				gender: findIndexGender(vm.editingUser.gender),
				college: findIndexCollege(vm.editingUser.college),
				userType: findIndexUserType(vm.editingUser.userType),
				approval: findIndexApproval(vm.editingUser.piApproval),
				project: findIndexProject(vm.editingUser.project),
				term: findIndexTerm(vm.editingUser.semester)
			};
			var indexRank;

			// Assign to drop down box if index was found (the value existed)
			// Otherwise reset selected index of drop down box

			if (indexes.gender != -1)
				$scope.editUserGender = vm.genderOptions[indexes.gender];
			else
				document.getElementById("ddGender").selectedIndex = -1;
			if (indexes.college != -1)
				$scope.editUserCollege = vm.colleges[indexes.college];
			else
				document.getElementById("ddCollege").selectedIndex = -1;

			if (indexes.userType != -1) {
				$scope.editUserType = vm.typeranks[indexes.userType];
				// Modify and search for rank
				vm.getEditRanks(vm.typeranks[indexes.userType]);
				indexRank = findIndexEditRank(vm.editingUser.rank);
				console.log("index rank", indexRank);
			}
			else {
				document.getElementById("ddUserType").selectedIndex = -1;
				indexRank = -1;
			}

			if (indexRank != -1)
				$scope.editUserRank = vm.typeranks[indexes.userType].ranks[indexRank];
			else
				document.getElementById("ddRank").selectedIndex = -1;
			if (indexes.approval != -1)
				$scope.editUserPIApproval = vm.booleanOptions[indexes.approval];
			else
				document.getElementById("ddPIApproval").selectedIndex = -1;
			if (indexes.project != -1)
				$scope.editUserProject = vm.allprojects[indexes.project];
			else
				document.getElementById("ddProject").selectedIndex = -1;
			if (indexes.term != -1)
				$scope.editUserTerm = vm.terms[indexes.term];
			else
				document.getElementById("ddTerm").selectedIndex = -1;
        };

		// List of functions to find object references that match the user value
		function findIndexGender(gender) {
			if (gender)
				for (var i=0; i<vm.genderOptions.length; i++)
                    if (vm.genderOptions[i].type == gender)
                        return i;
			return -1;
		};

		function findIndexCollege(college) {
			if (college)
				for (var i=0; i<vm.colleges.length; i++)
                    if (vm.colleges[i].name == college)
                        return i;
			return -1;
		};

		function findIndexUserType(userType) {
			if (userType)
				for (var i=0; i<vm.typeranks.length; i++)
                    if (vm.typeranks[i].name == userType)
                        return i;
			return -1;
		};

		function findIndexEditRank(rank) {
			if (rank)
				for (var i=0; i<vm.editRanks.length; i++)
                    if (vm.editRanks[i] == rank)
                        return i;
			return -1;
		};

		function findIndexApproval(rank) {
			if (rank == true)
				return 0;
			else if (rank == false)
				return 1;
			else
				return -1;
		};

		function findIndexProject(project) {
			if (project)
				for (var i=0; i<vm.allprojects.length; i++)
                    if (vm.allprojects[i].title == project)
                        return i;
			return -1;
		};

		function findIndexTerm(term) {
			if (term)
				for (var i=0; i<vm.terms.length; i++)
                    if (vm.terms[i].name == term)
                        return i;
			return -1;
		};

		vm.newUser; // Stores new user after its created

		// Add newly created user
		vm.addUser = function() {
			vm.newUser = null;
			// First check if required information is missing
			if ($scope.addUserFirstName && $scope.addUserLastName && $scope.addUserEmail) {
				// Then check if email and password is valid
				if (validateEmail($scope.addUserEmail) && validatePassword($scope.addUserPassword) && validatePassword($scope.addUserPasswordConf) && $scope.addUserPassword == $scope.addUserPasswordConf) {
					// Create user object
					var newUser = {
						firstName: $scope.addUserFirstName,
						lastName: $scope.addUserLastName,
						email: $scope.addUserEmail,
						RegDate: DateTimeService.getCurrentDateTimeAsString(),
						adminCreated: true
					};

					if ($scope.addUserPassword)
						newUser["password"] = $scope.addUserPassword;
					if ($scope.addUserPasswordConf)
						newUser["passwordConf"] = $scope.addUserPasswordConf;
					if ($scope.addUserRank)
						newUser["rank"] = $scope.addUserRank;
					if ($scope.addUserPID)
						newUser["pantherID"] = $scope.addUserPID;
					if ($scope.addUserGender)
						newUser["gender"] = $scope.addUserGender.type;
					if ($scope.addUserProject)
					if ($scope.addUserPIApproval)
						newUser["piApproval"] = $scope.addUserPIApproval.type;
					if ($scope.addUserCollege)
						newUser["college"] = $scope.addUserCollege.name;
					if ($scope.addUserType)
						newUser["userType"] = $scope.addUserType.name;
					if ($scope.addUserTerm)
						newUser["semester"] = $scope.addUserTerm.name;

					if (newUser.project)
						newUser["joined_project"] = true;
					else
						newUser["joined_project"] = false;

					console.log("Adding User", newUser);

					// Send POST request
					User.create(newUser).then(function(data) {
						if (data) {
							if (data.data.success) {
								document.getElementById('addUserMessage').innerHTML = 'Adding user was successful';
								vm.newUser = data.data.object;
								console.log('Added User', data.data, data.data.object);
								// Update the project if user is added to one
								if (newUser.project)
									addUserToProject(newUser);
							}
							else {
								document.getElementById('addUserMessage').innerHTML = 'Error: HTTP request failed';
								console.log(data);
							}
						} else { // http error
							document.getElementById('addUserMessage').innerHTML = 'Error: HTTP response not received';
							console.log('Error: Adding user failed');
						}
					});
				}
				else {
					if (!validateEmail($scope.addUserEmail)) {
						document.getElementById('addUserMessage').innerHTML = 'Error: Invalid Email Address';
						console.log("Error: Invalid Email Address");
					}
					else if (!validatePassword($scope.addUserPassword) || !validatePassword($scope.addUserPasswordConf)) {
						document.getElementById('addUserMessage').innerHTML = 'Error: Invalid Password';
						console.log("Error: Invalid Password");
					}
					else {
						document.getElementById('addUserMessage').innerHTML = 'Error: Mismatched Passwords';
						console.log("Error: Mismatched Passwords");
					}
				}
			}
			else {
				document.getElementById('addUserMessage').innerHTML = 'Error: Missing required information';
				console.log("Error: Missing required information");
			}
		};

		// Save changes to editing user
		vm.saveChangesUser = function() {
			// First check if required information is missing
			if ($scope.editUserFirstName && $scope.editUserLastName && $scope.editUserEmail) {
				// Then check if email is valid
				if (validateEmail($scope.editUserEmail)) {
					// Update editingUser
					vm.editingUser.firstName = $scope.editUserFirstName;
					vm.editingUser.lastName = $scope.editUserLastName;
					vm.editingUser.email = $scope.editUserEmail;

					if ($scope.editUserRank)
						vm.editingUser.rank = $scope.editUserRank;
					else
						vm.editingUser.rank = null;
					if ($scope.editUserPID)
						vm.editingUser.pantherID = $scope.editUserPID;
					else
						vm.editingUser.pantherID = null;
					if ($scope.editUserGender)
						vm.editingUser.gender = $scope.editUserGender.type;
					else
						vm.editingUser.gender = null;
					if ($scope.editUserProject)
						vm.editingUser.project = $scope.editUserProject.title;
					else
						vm.editingUser.project = null;
					if ($scope.editUserPIApproval)
						vm.editingUser.piApproval = $scope.editUserPIApproval.type;
					else
						vm.editingUser.piApproval = null;
					if ($scope.editUserCollege)
						vm.editingUser.college = $scope.editUserCollege.name;
					else
						vm.editingUser.college = null;
					if ($scope.editUserType)
						vm.editingUser.userType = $scope.editUserType.name;
					else
						vm.editingUser.userType = null;
					if ($scope.editUserTerm)
						vm.editingUser.semester = $scope.editUserTerm.name;
					else
						vm.editingUser.semester = null;


					if (vm.editingUser.project)
						vm.editingUser.joined_project = true;
					else
						vm.editingUser.joined_project = false;

					console.log("Editing User", vm.editingUser);

					// Send PUT request
					User.update({user: vm.editingUser}).then(function(data) {
						if (data) {
							if (data.data.success) {
								document.getElementById('editUserMessage').innerHTML = 'Editing user was successful';
								console.log('Edited User');
								
								// Update the projects that are associated with the given user (name and email)
								if (vm.editingUserOrig.firstName != vm.editingUser.firstName || vm.editingUserOrig.lastName != vm.editingUser.lastName || vm.editingUserOrig.email != vm.editingUser.email)
									updateProjects();

								// Update the project users if user is added to one
								if (!vm.editingUserOrig.project && vm.editingUser.joined_project)
									addUserToProject(vm.editingUser);
								// Send notification and update project if user was removed from project
								else if (vm.editingUserOrig.project && !vm.editingUser.joined_project)
									removeUserFromProject(vm.editingUser, vm.editingUserOrig.project, true);
								// Update both projects users if user is moved from one project to another
								else if (vm.editingUserOrig.project != vm.editingUser.project && vm.editingUser.joined_project)
									updateProjectsUser(vm.editingUser, vm.editingUserOrig.project);
							}
							else {
								document.getElementById('editUserMessage').innerHTML = 'Error: HTTP request failed';
								console.log(data);
								// Refresh user panel
								vm.tabledata = JSON.stringify(vm.filteredusers);
								vm.tabledata = eval(vm.tabledata);
							}
						} else { // http error
							document.getElementById('editUserMessage').innerHTML = 'Error: HTTP response not received';
							console.log('Error: Adding user failed');
							// Refresh user panel
							vm.tabledata = JSON.stringify(vm.filteredusers);
							vm.tabledata = eval(vm.tabledata);
						}
					});
				}
				else {
					document.getElementById('editUserMessage').innerHTML = 'Error: Invalid Email Address';
					console.log("Error: Invalid Email Address");
				}
			}
			else {
				document.getElementById('editUserMessage').innerHTML = 'Error: Missing required information';
				console.log("Error: Missing required information");
			}
		};
		
		// US 1328 - Update the projects that are currently associated with the given user
		function updateProjects() {
			var profileName = vm.editingUser.firstName + ' ' + vm.editingUser.lastName;
		
			// Find projects that contain the user
			vm.allprojects.forEach(function (project) {
				var found = false;
				
				if (project.owner_email == vm.editingUserOrig.email) {
					found = true;
					console.log("Found owner:", project.owner_email, vm.editingUserOrig.email);
					project.owner_name = profileName;
					project.owner_email = vm.editingUser.email;
				}
				
				project.members.forEach(function (memberEmail, index) {
					if (memberEmail == vm.editingUserOrig.email) {
						found = true;
						console.log("Found member:", project.owner_email, vm.editingUserOrig.email);
						project.members_detailed[index] = profileName;
						project.members[index] = vm.editingUser.email;
					}
				});
				
				project.faculty.forEach(function (faculty, index) {
					if (faculty.email == vm.editingUserOrig.email) {
						found = true;
						console.log("Found faculty:", faculty.email, vm.editingUserOrig.email);
						project.faculty[index].name = profileName;
						project.faculty[index].email = vm.editingUser.email;
					}
				});
				
				project.mentor.forEach(function (mentor, index) {
					if (mentor.email == vm.editingUserOrig.email) {
						found = true;
						console.log("Found mentor:", mentor.email, vm.editingUserOrig.email);
						project.mentor[index].name = profileName;
						project.mentor[index].email = vm.editingUser.email;
					}
				});
				
				// Update project if associated with user
				if(found) {
					ProjectService.editProject(project, project._id).then(function (data) {
						if (data) {
							if (data.data.message == 'Updated!') {
								console.log('Updated Project (username/email)', data);
							}
							else {
								console.log('Project Update (username/email) failed', data);
							}
						} else { // http error
							console.log('Error: Updating project (username/email) failed');
						}
					});						
				}
			});
			// Refresh projects panel
			vm.tabledata_p = JSON.stringify(vm.filteredprojects);
			vm.tabledata_p = eval(vm.tabledata_p);
		}

		// Update the project if user is added to one
        function addUserToProject(user) {
			var project;

			for (var i = 0; i < vm.allprojects.length; i++) {
                if (vm.allprojects[i].title == user.project) {
                    project = vm.allprojects[i];
                }
            }

			// Check user isnt already part of the project (should not happen)
			var exists = false;
			for (var j = 0; j < project.members.length; j++) {
                if (project.members[j] == user.email) {
                    exists = true;
					break;
                }
            }
			if(!exists) {
				project.members_detailed.push(user.firstName + " " + user.lastName);
				project.members.push(user.email);
				ProjectService.editProject(project, project._id);
				console.log("Added User to project", project);
				// Refresh projects panel
				vm.tabledata_p = JSON.stringify(vm.filteredprojects);
				vm.tabledata_p = eval(vm.tabledata_p);
			}
        };

		// Update the project if user is removed from one
        function removeUserFromProject(user, formerProject, sendNotification) {
            var name = user.firstName + " " + user.lastName;
            var email = user.email;

            for (i = 0; i < vm.allprojects.length; i++) {
                if (vm.allprojects[i].title == formerProject) {
                    formerProject = vm.allprojects[i];
                }
            }

			if (formerProject) {
				for (i = 0; i < formerProject.members.length; i++) {
					if (formerProject.members[i] == email) {
						formerProject.members.splice(i, 1);
						formerProject.members_detailed.splice(i, 1);
						break;
					}
				}
				ProjectService.editProject(formerProject, formerProject._id);
				console.log("Removed User from project");
				// Refresh projects panel
				vm.tabledata_p = JSON.stringify(vm.filteredprojects);
				vm.tabledata_p = eval(vm.tabledata_p);
			}
			if (sendNotification)
				sendEmailRemovedProject(name, email, formerProject);
        };

		// Send notification user has been removed from project
		function sendEmailRemovedProject(name, email, formerProject) {
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
		};

		// Update the both projects if user is moved from one project to another
        function updateProjectsUser(user, formerProject) {
			console.log("Testing moving user project");
			addUserToProject(user);
			removeUserFromProject(user, formerProject, false);
        };

		vm.deletingUser;

		vm.selectDeleteUser = function(user) {
			vm.deletingUser = user;
		};

		// Delete selected user
		vm.deleteUser = function() {
			User.delete(vm.deletingUser._id).then(function(data) {
				if (data) {
					if (data.data.message == 'successfully deleted!') {
						document.getElementById('deleteUserMessage').innerHTML = 'Deleting user was successful';
						console.log('Deleted User');
						// Remove user from project if user was in one
						if (vm.deletingUser.project)
							removeUserFromProject(vm.deletingUser, vm.deletingUser.project, false);
					}
					else {
						document.getElementById('deleteUserMessage').innerHTML = 'Error: HTTP request failed';
						vm.deletingUser = null;
						console.log(data);
					}
				} else { // http error
					document.getElementById('deleteUserMessage').innerHTML = 'Error: HTTP response not received';
					vm.deletingUser = null;
					console.log('Error: Adding user failed');
				}
            });
		};

		// Add/remove the user from vm.tabledata after user has been added/deleted

		vm.updateTableAdd = function() {
			if (vm.newUser) {
				vm.filteredusers.push(vm.newUser);
				vm.tabledata = JSON.stringify(vm.filteredusers);
				vm.tabledata = eval(vm.tabledata);
			}
		};

		vm.updateTableDelete = function() {
			if (vm.deletingUser) {
				var ind = -1;
				for (var i=0; i<vm.filteredusers.length; i++)
					if (vm.filteredusers[i]._id == vm.deletingUser._id)
						ind = i;

				if(ind != -1) {
					vm.filteredusers.splice(ind, 1);
				}
				vm.tabledata = JSON.stringify(vm.filteredusers);
				vm.tabledata = eval(vm.tabledata);
			}
			vm.deletingUser = null;
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
        };

		vm.getAddRanks = function(usertype) {
			//console.log(usertype, usertype.name);
			var found = false;
            if (usertype) {
                vm.typeranks.forEach(function (obj) {
					//console.log(obj.name, usertype.name);
                    if (obj.name == usertype.name) {
                        vm.addRanks = obj.ranks;
						found = true;
                    }
                });
            }
			if(!found)
				vm.addRanks = [];

        };

		vm.getEditRanks = function(usertype) {
			//console.log(usertype, usertype.name);
			var found = false;
            if (usertype) {
                vm.typeranks.forEach(function (obj) {
					//console.log(obj.name, usertype.name);
                    if (obj.name == usertype.name) {
                        vm.editRanks = obj.ranks;
						found = true;
                    }
                });
            }
			if(!found)
				vm.editRanks = [];
        };
		
		// User Story #1313
	
		vm.statusList = [{type: 'Active'}, {type: 'Disabled'}];

		// Fill in edit project form with existing values in project
		vm.editProject = function(project) {
			console.log("In edit project");
			vm.editingProject = project;
			vm.editingProjOrigTitle = project.title;

			// Set initial values of input to be current projects values
			$scope.editPTitle = vm.editingProject.title;
			$scope.editPDescription = vm.editingProject.description;
			$scope.editPMaxStudents = vm.editingProject.maxStudents;
			$scope.editPUrl = vm.editingProject.video_url;

			// Search for indexes for references to projects's values (if they exist)
			var indexes = {
				owner: findIndexOwner(vm.editingProject.owner_name),
				term: findIndexTerm(vm.editingProject.semester),
				status: findIndexStatus(vm.editingProject.status)
			};

			// Assign to drop down box if index was found (the value existed)
			// Otherwise reset selected index of drop down box

			if (indexes.owner != -1)
				$scope.editPOwner = vm.allusers[indexes.owner];
			else
				document.getElementById("ddOwnerP").selectedIndex = -1;
			if (indexes.term != -1)
				$scope.editPTerm = vm.terms[indexes.term];
			else
				document.getElementById("ddTermP").selectedIndex = -1;
			if (indexes.status != -1)
				$scope.editPStatus = vm.statusList[indexes.status];
			else
				document.getElementById("ddStatusP").selectedIndex = -1;
		};

		function findIndexOwner(owner) {
			var userName;
			if (owner)
				for (var i=0; i<vm.allusers.length; i++) {
					userName = vm.allusers[i].firstName + ' ' + vm.allusers[i].lastName;
                    if (userName == owner) {
                        return i;
					}
				}
			return -1;
		};

		function findIndexStatus(status) {
			if (status)
				for (var i=0; i<vm.statusList.length; i++)
                    if (vm.statusList[i].type == status)
                        return i;
			return -1;
		};

		// Save changes to edited project
		vm.saveChangesProject = function() {
			// First check if required information is missing
			if ($scope.editPTitle) {
				// Then check if there are illegal values
				if ($scope.editPMaxStudents < 0) {
					document.getElementById('editProjectMessage').innerHTML = 'Error: Max Students must be a positive value';
					console.log('Error: Max Students must be a positive value');
				}
				else if ($scope.editPMaxStudents < vm.editingProject.members.length) {
					document.getElementById('editProjectMessage').innerHTML = 'Error: Max Students should not be less than currently enlisted member count';
					console.log('Error: Max Students should not be less than currently enlisted member count');
				}
				else if ($scope.editPStatus.type == 'Active' && vm.terms[findIndexTerm($scope.editPTerm.name)].status != 'Active') {
					document.getElementById('editProjectMessage').innerHTML = 'Error: Cannot set project to Active status in a non-active semester';
					console.log('Error: Cannot set project to Active status in a non-active semester');
				}
				else { // Update editingProject
					vm.editingProject.title = $scope.editPTitle;
					vm.editingProjNewTitle = $scope.editPTitle;
					vm.editingProject.description = $scope.editPDescription;
					vm.editingProject.maxStudents = $scope.editPMaxStudents;
					vm.editingProject.video_url = ProcessVideoURL($scope.editPUrl);

					if ($scope.editPOwner) {

						var projectOwner = vm.allusers[findIndexOwner($scope.editPOwner.firstName + ' ' + $scope.editPOwner.lastName)];

						vm.editingProject.owner = projectOwner._id;
						vm.editingProject.owner_name = projectOwner.firstName + ' ' + projectOwner.lastName;
						vm.editingProject.owner_email = projectOwner.email;
						vm.editingProject.owner_rank = projectOwner.rank;
					}
					else {
						vm.editingProject.owner = null;
						vm.editingProject.owner_name = null;
						vm.editingProject.owner_email = null;
						vm.editingProject.owner_rank = null;
					}
					if ($scope.editPTerm)
						vm.editingProject.semester = $scope.editPTerm.name;
					else
						vm.editingProject.semester = null;

					if ($scope.editPStatus)
                        vm.editingProject.status = $scope.editPStatus.type; 
					else
						vm.editingProject.status = null;

					console.log("Editing Project", vm.editingProject);

					// Send PUT request
					ProjectService.editProject(vm.editingProject, vm.editingProject._id).then(function(data) {
						if (data) {
							if (data.data.message == 'Updated!') {
                                document.getElementById('editProjectMessage').innerHTML = 'Editing project was successful';
                                sendDeactivationEmail();
								console.log('Edited Project');
								// Update users associated with this project if project title has changed
								if (vm.editingProjOrigTitle != vm.editingProjNewTitle)
									updateUsers();
							}
							else {
								document.getElementById('editProjectMessage').innerHTML = 'Error: HTTP request failed';
								console.log(data);
								// Refresh projects panel
								vm.tabledata_p = JSON.stringify(vm.filteredprojects);
								vm.tabledata_p = eval(vm.tabledata_p);
							}
						} else { // http error
							document.getElementById('editProjectMessage').innerHTML = 'Error: HTTP response not received';
							console.log('Error: Editing project failed');
							// Refresh projects panel
							vm.tabledata_p = JSON.stringify(vm.filteredprojects);
							vm.tabledata_p = eval(vm.tabledata_p);
						}
					});
				}
			}
			else {
				document.getElementById('editProjectMessage').innerHTML = 'Error: Missing required information';
				console.log("Error: Missing required information");
			}

		};
		
		// User story #1238 - Update users associated with this project if project title has changed
		function updateUsers() {
			vm.allusers.forEach(function (user) {
				if (user.project == vm.editingProjOrigTitle) {
					console.log("Found project in user:", user.firstName, user.project, vm.editingProjOrigTitle);
					user.project = vm.editingProjNewTitle;
		
					// Update the user with new project title
					User.update({user: user}).then(function(data) {
						if (data) {
							if (data.data.success) {
								console.log('Updating user (project title) was successful');
							}
							else {
								console.log('Error: HTTP request failed', data);
							}
						} else { // http error
							console.log('Error: HTTP response not received');
						}
					});
				}
			});
			// Refresh user panel
			vm.tabledata = JSON.stringify(vm.filteredusers);
			vm.tabledata = eval(vm.tabledata);
		};
        
    function sendDeactivationEmail() {
            var email;
            if (vm.editingProject.status == 'Disabled') {
                console.log('Inside Dale Code');
                for (i = 0; i < vm.editingProject.members.length; i++) {
                    console.log('Inside Dale Code For loop');
                    email = vm.editingProject.members[i];
                    console.log(email);
                    var email_msg =
                    {
                        recipient: email,
                        text: "Your current project '" + vm.editingProject.title + "' has been disabled. For more information, please contact a PI.",
                        subject: "Project No Longer Available",
                        recipient2: vm.adminSettings.current_email,
                        text2: "The project '" + vm.editingProject.title + "' has been disabled. All students who were in the project have been notified and asked to contact a PI for further instruction.",
                        subject2: "Project Deactivated"
                    };
                    User.nodeEmail(email_msg);
                    vm.editingProject.status = null;
                    // removeUserFromProject(vm.editProjectUsers[i], vm.editingProject, false);
                    // vm.tabledata = JSON.stringify(vm.filteredusers);
                    // vm.tabledata = eval(vm.tabledata);
                }
            }
        }

		function ProcessVideoURL(VideoURL) {
			// format the youtube videos correctly
			// input: https://www.youtube.com/watch?v=uQ_DHRI-Xp0
			// output: https://www.youtube.com/embed/uQ_DHRI-Xp0
			if (VideoURL) {
				// video is already embed format, return
				if (VideoURL.indexOf("youtube.com/embed/") > -1) {
					return VideoURL;
				}

				// youtube.com universal filter
				if (VideoURL.indexOf("youtube.com") > -1) {
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
        };


		vm.editProjectUsers = function(project) {
			vm.editingProject = project;
			vm.editingProjOrigMembers = Array.from(vm.editingProject.members);
		};

		vm.addStudentProject = function() {
			if ($scope.addPUser) {
				var addStudent = $scope.addPUser;
				var found = false;
				for (i = 0; i < vm.editingProject.members.length; i++)
					if (vm.editingProject.members[i] == addStudent.email) {
						found = true; break;
					}
				if (!found) { // Add student into project list if they are not already in the project
					vm.editingProject.members_detailed.push(addStudent.firstName + ' ' + addStudent.lastName);
					vm.editingProject.members.push(addStudent.email);
				}
			}
		};

		vm.removeStudentProject = function(removingStudent) {
			// Remove student from project roster
			for (i = 0; i < vm.editingProject.members.length; i++) {
				if (vm.editingProject.members_detailed[i] == removingStudent) {
					vm.editingProject.members.splice(i, 1);
					vm.editingProject.members_detailed.splice(i, 1);
				}
			}
		};

		vm.editingProjectNew;

		// Update Project's users information
		vm.saveChangesProjectUsers = function() {
			console.log("Editing Projects Users", vm.editingProject);
			// Send PUT request
			ProjectService.editProject(vm.editingProject, vm.editingProject._id).then(function(data) {
				if (data) {
					if (data.data.message == 'Updated!') {
						document.getElementById('editProjectMessage').innerHTML = 'Editing projects users was successful';
						console.log('Edited Projects Users');

						vm.editingProjectNew = Array.from(vm.editingProject.members);
						updateProjectUsers(vm.editingProject.title, vm.editingProjectNew, vm.editingProjOrigMembers);
						// Refresh User Panel
						vm.tabledata = JSON.stringify(vm.filteredusers);
						vm.tabledata = eval(vm.tabledata);
					}
					else {
						document.getElementById('editProjectMessage').innerHTML = 'Error: HTTP request failed';
						console.log(data);
						// Refresh projects panel
						vm.tabledata_p = JSON.stringify(vm.filteredprojects);
						vm.tabledata_p = eval(vm.tabledata_p);
					}
				} else { // http error
					document.getElementById('editProjectMessage').innerHTML = 'Error: HTTP response not received';
					console.log('Error: Editing project failed');
					// Refresh projects panel
					vm.tabledata_p = JSON.stringify(vm.filteredprojects);
					vm.tabledata_p = eval(vm.tabledata_p);
				}
			});
		};

		function updateProjectUsers(project, projectMembers, formerProjectMembers) {
			var i,j;
			// Find added users and update them
			for (i = 0; i < projectMembers.length; i++) {
				var found = false;
				for (j = 0; j < formerProjectMembers.length; j++) {
					if (formerProjectMembers[j] == projectMembers[i]) {
						found = true;
						break;
					}
				}
				if (!found) {
					console.log('found added user', projectMembers[i]);
					var pUser = vm.allusers[findIndexUser(projectMembers[i])];
					if (pUser) {
						pUser.project = project;
						pUser.joined_project = true;
						User.update({user: pUser}).then(function(data) {
							if (data) {
								if (data.data.success) {
									console.log('Added user updated');
								}
								else {
									console.log(data);
								}
							} else { // http error
								console.log('Error: Updating added user failed');
							}
						});
					}
					else {
						console.log('Error: Could not find added user');
					}
				}
			}
			// Find removed users and delete them
			for (j = 0; j < formerProjectMembers.length; j++) {
				var found = false;
				for (i = 0; i < projectMembers.length; i++) {
					if (formerProjectMembers[j] == projectMembers[i]) {
						found = true;
						break;
					}
				}
				if (!found) {
					console.log('found removed user', formerProjectMembers[j]);
					var pUser = vm.allusers[findIndexUser(formerProjectMembers[j])];
					if (pUser) {
						pUser.project = null;
						pUser.joined_project = false;
						User.update({user: pUser}).then(function(data) {
							if (data) {
								if (data.data.success) {
									console.log('Removed user updated');
								}
								else {
									console.log(data);
								}
							} else { // http error
								console.log('Error: Updating removed user failed');
							}
						});
					}
					else {
						console.log('Error: Could not find removed user');
					}
				}
			}
		};

		function findIndexUser(email) {
			for (i = 0; i < vm.allusers.length; i++) {
				if (vm.allusers[i].email == email)
					return i;
			}
			return -1;
		};


		vm.deletingProject;

		vm.selectDeleteProject = function(project) {
			vm.deletingProject = project;
		}

		vm.deleteProject = function() {
			ProjectService.delete(vm.deletingProject._id).then(function(data) {
				if (data) {
					console.log('Delete test Data', data);
					if (data.message == 'successfully deleted!') {
						document.getElementById('deleteProjectMessage').innerHTML = 'Deleting project was successful';
						console.log('Deleted Project');
						// Remove project from all users (if any) in deleted project
						if (typeof vm.deletingProject.members != "undefined" && vm.deletingProject.members != null && vm.deletingProject.members.length > 0)
							updateProjectUsers(vm.deletingProject.title, [], vm.deletingProject.members);
						// Refresh User Panel
						vm.tabledata = JSON.stringify(vm.filteredusers);
						vm.tabledata = eval(vm.tabledata);
					}
					else {
						document.getElementById('deleteProjectMessage').innerHTML = 'Error: HTTP request failed';
						vm.deletingProject = null;
						console.log(data);
					}
				} else { // http error
					document.getElementById('deleteProjectMessage').innerHTML = 'Error: HTTP response not received';
					vm.deletingProject = null;
					console.log('Error: Deleting project failed');
				}
            });
		};

		vm.updatePTableDelete = function() {
			if (vm.deletingProject) {
				var ind = -1;
				for (var i=0; i<vm.filteredprojects.length; i++)
					if (vm.filteredprojects[i]._id == vm.deletingProject._id)
						ind = i;

				if(ind != -1) {
					vm.filteredprojects.splice(ind, 1);
				}
				vm.tabledata_p = JSON.stringify(vm.filteredprojects);
				vm.tabledata_p = eval(vm.tabledata_p);
			}
			vm.deletingProject = null;
		};

		// End US #1313


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
			// User story - 1176
			loadAllProjects();
            // Joe's User Story
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
                console.log("***********************")
                console.log(vm.tabledata)
                console.log(vm.filteredusers)
            });
        }

        //Loads all project information for active projects
        function loadProjects() {
            reviewStudentAppService.loadProjects().then(function (data) {
                vm.projects = data;
            });
        }

		//Loads all project information regardless of status
        function loadAllProjects() {
            reviewStudentAppService.loadAllProjects().then(function (data) {
                vm.allprojects = data;
				vm.filteredprojects = vm.allprojects;
				// Store the project data into vm.tabledata_p
                vm.tabledata_p = JSON.stringify(vm.allprojects);
                vm.tabledata_p = eval(vm.tabledata_p);
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

            for (var i = 1; i <= 17; i++) {
                $scope['query' + i] = '';
            }
            $scope.selectedusertype = '';
            $scope.selecteduserrank = '';
			$scope.selecteduserproject = '';
            $scope.SelectedProject = '';
            $scope.selectedPiApproval = '';
            $scope.selectedGoogle = '';
			// userstory #1176
			$scope.selectedTerm = '';

        }


		vm.uncheckp = function () {
			// userstory #1176
			for (var i = 1; i <= 12; i++) {
                $scope['queryp' + i] = '';
            }
			$scope.selectedPOwner = '';
			$scope.selectedPTerm = '';
			$scope.selectedPStatus = '';
        }


        //Filters users based on parameters
        function filterUsers(selectedPiApproval, selectedGoogle, selectedusertype, selecteduserrank, SelectedProject, selectedTerm) {
            vm.filteredusers = vm.allusers;
            // n^2
            if (SelectedProject) {
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
            if (selectedusertype) {
                var tempArray = [];
                vm.filteredusers.forEach(function (obj) {
                    if (obj.userType == selectedusertype.name) {
                        tempArray.push(obj);
                    }
                });
                vm.filteredusers = tempArray;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            }
            if (selecteduserrank) {
                var tempArray = [];
                vm.filteredusers.forEach(function (obj) {
                    if (obj.userRank == selecteduserrank) {
                        tempArray.push(obj);
                    }
                });
                vm.filteredusers = tempArray;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            }
			// # userstory 1176
			if (selectedTerm) {
                var tempArray = [];
                vm.filteredusers.forEach(function (obj) {
                    if (obj.semester == selectedTerm.name) {
                        tempArray.push(obj);
                    }
                });
                vm.filteredusers = tempArray;
                vm.tabledata = JSON.stringify(vm.filteredusers);
                vm.tabledata = eval(vm.tabledata);
            }
            if (selectedPiApproval) {
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
            if (selectedGoogle) {
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
			/* -- Both of these are inefficient and not in use, no users have either of these properties set
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
			*/
        }

		//Filters projects based on parameters
        function filterProjects(selectedPTerm) {
			// # userstory 1176
			vm.filteredprojects = vm.allprojects;
			if (selectedPTerm) {
                var tempArray = [];
                vm.filteredprojects.forEach(function (obj) {
                    if (obj.semester == selectedPTerm.name) {
                        tempArray.push(obj);
                    }
                });
                vm.filteredprojects = tempArray;
                vm.tabledata_p = JSON.stringify(vm.filteredprojects);
                vm.tabledata_p = eval(vm.tabledata_p);
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
