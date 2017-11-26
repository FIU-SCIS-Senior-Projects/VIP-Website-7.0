  (function () {
    'use strict';

    angular
        .module('admin',['ui.bootstrap','angularUtils.directives.dirPagination','ui.toggle', 'mp.datePicker'])
        .filter("dateFilter", function() {
          return function(newDate) {
            return new Date(newDate);
          }
        })
        .controller('adminController', adminCtrl)
    function adminCtrl($location, $window, $state,$timeout, $scope, $stateParams, adminService, User, reviewStudentAppService, ProfileService, reviewRegService, reviewProfileService, ProjectService, DateTimeService) {
        var vm = this;
        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        $scope.showUserMaint = false
        $scope.showSemesterMaint = false
        $scope.showProjectMaint = false
        $scope.showAdminPage = true
		    $scope.showCoursePage = false
        $scope.routeUserMaint = routeUserMaint
        $scope.routeProjectMaintenance = routeProjectMaintenance
        $scope.routeSemesterMaintenance = routeSemesterMaintenance
        $scope.routeAdminMaint = routeAdminMaint
        $scope.routeCourseMaintenance = routeCourseMaintenance
        vm.currentSwitchStatus;
        vm.proposableSwitchStatus;
        vm.viewableSwitchStatus;
        vm.applicableSwitchStatus;
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

function updateSelectedSemesterQueries(selectedSemester) {
  $scope.query14 = selectedSemester;
  $scope.queryp5 = selectedSemester;
  $scope.queryC3 = selectedSemester;
}


function selectedItemChange(item) {
  $log.info('Item changed to ' + JSON.stringify(item));
}
        function routeAdminMaint(){
          $scope.showUserMaint = false;
          $scope.showSemesterMaint = false;
          $scope.showProjectMaint = false;
          $scope.showAdminPage = true;
          $scope.showCoursePage = false;
        }
        function routeUserMaint(){
          $scope.showUserMaint = true;
          $scope.showSemesterMaint = false;
          $scope.showProjectMaint = false;
          $scope.showAdminPage = false;
          $scope.showCoursePage = false;
        }
        function routeProjectMaintenance(){
          $scope.showUserMaint = false;
          $scope.showSemesterMaint = false;
          $scope.showProjectMaint = true;
          $scope.showAdminPage = false;
          $scope.showCoursePage = false;
        }
        function routeSemesterMaintenance(){
          $scope.showUserMaint = false;
          $scope.showSemesterMaint = true;
          $scope.showProjectMaint = false;
          $scope.showAdminPage = false;
          $scope.showCoursePage = false;
        }
        function routeCourseMaintenance(){
          $scope.showUserMaint = false;
          $scope.showSemesterMaint = false;
          $scope.showProjectMaint = false;
          $scope.showAdminPage = false;
          $scope.showCoursePage = true;
        }
        ProfileService.loadProfile().then(function (data) {
            if (data) {
                $scope.done = true;
                vm.cuser = data;
                var profile = data;
                if (profile.userType != "Pi/CoPi") {
                    //$location.path("/");
                    $location.path('/').replace();
                }
                if(profile.selectedSemester) {
                  reviewStudentAppService.getTerm(profile.selectedSemester).then(function(term) {
                    updateSelectedSemesterQueries(term.name);
                    vm.defaultSemester = term.name;
                  })
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
		vm.courses; // Course list
        vm.terms;
        vm.currentSem;
        vm.currentSemesterName;
        vm.cStatus;
        vm.vStatus;
        vm.pStatus;
        vm.aStatus;
        // vm.currentSemesterName = [];// TODO Remove if not needed
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
		// User story #1346
		vm.courseFiles;
    vm.semesterToBeDeleted;

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
            if(term) {
              vm.cStatus = term.status.currentSemester;
              vm.vStatus = term.status.viewable;
              vm.pStatus = term.status.openForProposal;
              vm.aStatus = term.status.openForApply;
              if(vm.currentSwitchStatus == null) { vm.currentSwitchStatus = term.status.currentSemester; }
              if(vm.viewableSwitchStatus == null) { vm.viewableSwitchStatus = term.status.viewable; }
              if(vm.proposableSwitchStatus == null) { vm.proposableSwitchStatus = term.status.openForProposal; }
              if(vm.applicableSwitchStatus == null) { vm.applicableSwitchStatus = term.status.openForApply; }
            }
        }
        vm.sw = ChangeUserProject;
        vm.sc = ClearProject;

        //Joe's User Story
        vm.se = ChangeProjectStatus;
        vm.nw = ChangeTermStatus;

        vm.csf = currentSwitch;
        vm.vsf = viewableSwitch;
        vm.asf = applicableSwitch;
        vm.psf = proposableSwitch;
        vm.msc = makeSemesterChanges;
        vm.cns = createNewSemester;
        vm.ds = deleteSemester;
        vm.defsb = setDefaultSemester;
        vm.dsb = delSemButton;
        vm.esb = editSemButton;
        vm.rss = resetSemSettings;

        vm.usertype = ['Staff/Faculty', 'Pi/CoPi', 'Student', 'Undefined'];
        //Joe's User Story
        vm.status = ['Active', 'Disabled'];
        vm.active = ['Active', 'Disabled'];
        vm.open = ['Open', 'Closed'];
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

		// User Story 1345
		// Add a course
		vm.addCourse = function() {
			if (!$scope.addNewCourseInputSubject || !$scope.addNewCourseInputNumber || !$scope.addNewCourseInputSection || !$scope.addCourseTerm ||
				$scope.addNewCourseInputSubject.length < 3 || $scope.addNewCourseInputNumber.length < 4) {
				var errMsg = "";
				if (!$scope.addNewCourseInputSubject)
					errMsg += "\tSubject Missing\n";
				else if ($scope.addNewCourseInputSubject.length < 3)
					errMsg += "\tSubject is not 3 Character Code\n";
				if (!$scope.addNewCourseInputNumber)
					errMsg += "\tNumber Missing\n";
				else if ($scope.addNewCourseInputNumber.length < 4)
					errMsg += "\tNumber is not 4 Digit Number\n";
				if (!$scope.addNewCourseInputSection)
					errMsg += "\tSection Missing\n";
				if (!$scope.addCourseTerm)
					errMsg += "\tSemester Missing\n";

				swal({
                    title: "Error",
                    text: errMsg,
                    type: "error",
                    confirmButtonText: "Continue",
                    allowOutsideClick: true,
                    timer: 10000,
					}, function () {}
				);
			}

			else {
				// test if duplicate exists
				var courseName = $scope.addNewCourseInputSubject + ' ' + $scope.addNewCourseInputNumber + "-" + $scope.addNewCourseInputSection;
				var found = false;
				vm.courses.forEach(function (course) {
					if (course.name == courseName && course.semester == $scope.addCourseTerm.name)
						found = true;
                });
				if (!found) { // Create the new course and save it
					var newCourse = {
						name: courseName,
						subject: $scope.addNewCourseInputSubject,
						number: $scope.addNewCourseInputNumber,
						section: $scope.addNewCourseInputSection,
						semester: $scope.addCourseTerm.name,
						fullName: courseName + ' ' + $scope.addCourseTerm.name
					};

					if($scope.addNewCourseInputTitle != "")
						newCourse["title"] = $scope.addNewCourseInputTitle;

					adminService.addCourse(newCourse).then(function (data) {
						vm.courses.push(data);

						// Notify User of Added Course
						swal({
							title: "Success",
							text: "Course " + courseName + " has been added to the database",
							type: "success",
							confirmButtonText: "Continue",
							allowOutsideClick: true,
							timer: 10000,
							}, function () {}
						);
					});
					// Clear Input fields
					$scope.addNewCourseInputSubject = "";
					$scope.addNewCourseInputNumber = "";
					$scope.addNewCourseInputSection = "";
					$scope.addNewCourseInputTitle = "";
					$scope.addCourseTerm = "";
				}
			}
		};

		// Remove a course
		vm.removeCourse = function(removingCourse) {
			var courseName = removingCourse.fullName;

			adminService.deleteCourse(removingCourse._id).then(function (data) {
				if (data.message == "successfully deleted!") { // http delete request was successful
					// Remove from courses list
					vm.courses.forEach(function (course, index) {
						if (course.name == courseName)
							vm.courses.splice(index, 1);
					});

					// Go through users and remove them from the deleted course
					vm.allusers.forEach(function (user, index) {
						if (user.course == courseName) {
							user.course = null;
							User.update({user: user});
						}
					});
					// Refresh User panel
					vm.tabledata = JSON.stringify(vm.filteredusers);
					vm.tabledata = eval(vm.tabledata);

					// Clears the course file list & resets input
					vm.clearCourseFiles();

					// Notify User of Deleted Course
					swal({
						title: "Success",
						text: "Course " + courseName + " has been deleted from the database",
						type: "success",
						confirmButtonText: "Continue",
						allowOutsideClick: true,
						timer: 10000,
						}, function () {}
					);
				}
			});
		};

		// User Story #1362

		// Populate the edit course modal with current course info
		vm.editCourse = function(course) {
			vm.editingCourse = course;
			vm.editingCourseOrig = {
				name: course.name,
				fullName: course.fullName,
				semester: course.semester
			};

			// Set initial values of input to be current course values
			$scope.editCourseInputSubject = vm.editingCourse.subject;
			$scope.editCourseInputNumber = vm.editingCourse.number;
			$scope.editCourseInputSection = vm.editingCourse.section;
			$scope.editCourseInputTitle = vm.editingCourse.title;

			// Search for indexes for references to course's term (if they exist)
			var termIndex = findIndexTerm(vm.editingCourse.semester);

			// Assign to drop down box if term index was found (the value existed)
			// Otherwise reset selected term index of drop down box

			if (termIndex != -1)
				$scope.editCourseTerm = vm.terms[termIndex];
			else
				document.getElementById("editCourseTerm").selectedIndex = -1;

        };

		// Update the editing course with new information
		vm.saveChangesCourse = function() {
			// Check if required information is missing
			if ($scope.editCourseInputSubject && $scope.editCourseInputNumber && $scope.editCourseInputSection && $scope.editCourseTerm) {
				// Confirm that the changed course does not become a copy of an existing course
				var newFullName = $scope.editCourseInputSubject + ' ' + $scope.editCourseInputNumber + '-' + $scope.editCourseInputSection + ' ' + $scope.editCourseTerm.name;
				var found = false;
				vm.courses.forEach(function (course) {
					if (course.fullName == newFullName)
						found = true;
                });
				if (!found) {
					// Check for conflicts
					var conflicts = false;
					if ($scope.editCourseTerm.name != vm.editingCourseOrig.semester) {
						vm.allusers.forEach(function (user) {
							if (user.course == vm.editingCourseOrig.fullName && user.project) {
								conflicts = true;
							}
						});
					}
					if (conflicts) {
						// Ask for confirmation if there are conflicts available
						swal({
							title: "Alert",
							text: "There are users that conflict with the new course information, do you wish to remove the users from this course?",
							type: "warning",
							confirmButtonText: "Yes",
							showCancelButton: true,
							cancelButtonText: 'Cancel',
							allowOutsideClick: true,
							timer: 10000,
						}, function () {
							updateCourse(true);
						});
					}
					else
						updateCourse(false);
				}
				else {
					swal({
						title: 'Error',
						text: 'Course: ' + newFullName + ' already exists',
						type: "error",
						confirmButtonText: "Continue",
						allowOutsideClick: true,
						timer: 10000,
						}, function () {}
					);
				}
			}
			else {
				swal({
					title: 'Error',
					text: 'Missing required information',
					type: "error",
					confirmButtonText: "Continue",
					allowOutsideClick: true,
					timer: 10000,
					}, function () {}
				);
			}
		}

		// Updates the course
		function updateCourse(removeUsers) {
			// Update editingCourse
			vm.editingCourse.subject = $scope.editCourseInputSubject;
			vm.editingCourse.number = $scope.editCourseInputNumber;
			vm.editingCourse.section = $scope.editCourseInputSection;
			if (vm.editingCourse.title)
				vm.editingCourse.title = $scope.editCourseInputTitle;
			else
				vm.editingCourse['title'] = $scope.editCourseInputTitle;

			vm.editingCourse.semester = $scope.editCourseTerm.name;
			vm.editingCourse.name = vm.editingCourse.subject + ' ' + vm.editingCourse.number + '-' + vm.editingCourse.section;
			vm.editingCourse.fullName = vm.editingCourse.name + ' ' + vm.editingCourse.semester;

			// Send PUT request
			adminService.updateCourse(vm.editingCourse, vm.editingCourse._id).then(function(data) {
				if (data) {
					if (data.success) {
						// Update the users that are associated with the given course
						if (!removeUsers && vm.editingCourseOrig.fullName != vm.editingCourse.fullName)
							updateCourseUsers(removeUsers);
						else if (removeUsers)
							updateCourseUsers(removeUsers);

						swal({
							title: 'Success',
							text: 'Editing course was successful',
							type: "success",
							confirmButtonText: "Continue",
							allowOutsideClick: true,
							timer: 10000,
							}, function () {}
						);
					}
					else {
						// Refresh course panel
						vm.courses = eval(vm.courses);

						swal({
							title: 'Error',
							text: 'HTTP request failed',
							type: "error",
							confirmButtonText: "Continue",
							allowOutsideClick: true,
							timer: 10000,
							}, function () {}
						);
					}
				} else { // http error
					// Refresh course panel
					vm.courses = eval(vm.courses);

					swal({
						title: 'Error',
						text: 'HTTP response not received',
						type: "error",
						confirmButtonText: "Continue",
						allowOutsideClick: true,
						timer: 10000,
						}, function () {}
					);
				}
			});
		};

		// Update the course value for users in the editing course
		function updateCourseUsers(removeUsers) {
			vm.allusers.forEach(function (user) {
				if (user.course == vm.editingCourseOrig.fullName) {
					if (!removeUsers) {
						user.course = vm.editingCourse.fullName;
					}
					else {
						user.course = null;
						user.isEnrolled = false;
					}
					// Update the user
					User.update({user: user});
				}
			});
			// Refresh user panel
			vm.tabledata = JSON.stringify(vm.filteredusers);
			vm.tabledata = eval(vm.tabledata);
		};

		// User Story #1346

		vm.addCourseFileName;
		vm.addCourseData; // Holds the parsed XLS data after onchanged event fires

		// Parse the XLS file using File API
		function handleFile(e) {
			if (document.getElementById('courseFileInput').value) {
				var files = e.target.files, fileSource = files[0];
				var reader = new FileReader();
				reader.onload = function(e) {
					vm.addCourseData = parseXLS(e.target.result);
				};
				reader.readAsText(fileSource);

				// Read fileName and check if existing course exists to set as default course
				vm.addCourseFileName = document.getElementById('courseFileInput').value.replace(/.*[\/\\]/, '');
				parseFileName(vm.addCourseFileName);
			}
		};
		document.getElementById('courseFileInput').addEventListener('change', handleFile, false);

		// Updates the course select box with best fit course given the file name
		function parseFileName(file) {
			try {
				var currentTerms = [], currentTermIndex = -1;
				vm.terms.forEach(function (term, index) {
					if (term.status.currentSemester) {
						currentTerms.push(term.name);
						if (currentTermIndex == -1)
							currentTermIndex = index;
					}
				});

				// Start with cleared selection
				document.getElementById('syncCourseSelect').selectedIndex = -1;
				// Hide add course table
				$scope.showAddCourse = false;
				$scope.$digest();

				// Try to match a segment of the file name with a course from a current semester
				var found = false;
				vm.courses.forEach(function (course, index) {
					currentTerms.forEach(function (cTerm) {
						if (course.semester == cTerm) {
							if (file.match(course.name)) {
								// Update course selection box
								$scope.syncCourseSelect = vm.courses[index];
								document.getElementById('syncCourseSelect').selectedIndex = index+1;
								found = true;
							}
						}
					});
				});
				// Create a course object that would represent this course File
				if (!found) {
					// Try to find a pattern match for a complete course name
					var courseMatch = file.match(/[A-Z]{3}\s[0-9]{4}-[A-Z0-9]+/);
					//console.log("courseMatch:", file.match(/[A-Z]{3}\s[0-9]{4}-[A-Z0-9]+/));
					if (courseMatch) {
						var newCourseData = {
							subject: courseMatch[0].substr(0, 3),
							number: courseMatch[0].substr(4, 4),
							section: courseMatch[0].substr(9)
						};
						// Show add course table
						$scope.showAddCourse = true;
						// Populate the add course fields with matched data
						$scope.addNewCourseInputSubject2 = newCourseData.subject;
						$scope.addNewCourseInputNumber2 = newCourseData.number;
						$scope.addNewCourseInputSection2 = newCourseData.section;
						$scope.addCourseTerm2 = vm.terms[currentTermIndex];
						document.getElementById('addCourseTerm2').selectedIndex = currentTermIndex+1;
						$scope.$digest();

						// Prompt User to Comfirm course match
						swal({
							title: "Notice",
							text: "Confirm the creation of new course '" + courseMatch[0] + "' for " + currentTerms[0],
							type: "info",
							confirmButtonText: "Continue",
							allowOutsideClick: false,
							timer: 10000,
							}, function () {}
						);
					}
					else {
						// Show add course table
						$scope.showAddCourse = true;
						// Clear the add course fields
						$scope.addNewCourseInputSubject2 = "";
						$scope.addNewCourseInputNumber2 = "";
						$scope.addNewCourseInputSection2 = "";
						$scope.addCourseTerm2 = vm.terms[currentTermIndex];
						document.getElementById('addCourseTerm2').selectedIndex = currentTermIndex+1;
						$scope.$digest();
						// Prompt User to enter course information
						swal({
							title: "Notice",
							text: "Could not automatically generate a course for this file, please create a course for this file",
							type: "info",
							confirmButtonText: "Continue",
							allowOutsideClick: true,
							timer: 10000,
							}, function () {}
						);
					}
				}
			}
			catch (err) { /* Don't try match with filename that cannot be parsed */ }
		};

		// Adds a course file to course file list
		vm.addCourseFile = function() {
			if ($scope.syncCourseSelect && document.getElementById('courseFileInput').value) {
				// test if duplicate exists in courseFiles list
				var courseName = $scope.syncCourseSelect.fullName;
				var found = false;

				vm.courseFiles.forEach(function (courseFile) {
					if (courseFile.course.fullName == courseName)
						found = true;
				});
				if (!found) { // Create the new courseFile and add it to the list
					var newCourseFile = {
						course: $scope.syncCourseSelect,
						file: vm.addCourseFileName,
						data: vm.addCourseData
					};

					vm.courseFiles.push(newCourseFile);
					// Clear Data and UI
					$scope.syncCourseSelect = "";
					document.getElementById('syncCourseSelect').selectedIndex = -1;
					document.getElementById('courseFileInput').value = null;
					vm.addCourseFileName = null;
					vm.addCourseData = null;
					// Hide add course table
					$scope.showAddCourse = false;
				}
				else {
					swal({
						title: "Error",
						text: "Course already queued with file. Try again with another course or remove the course already queued",
						type: "error",
						confirmButtonText: "Continue",
						allowOutsideClick: true,
						timer: 10000,
						}, function () {}
					);
				}
			}
		};

		// Add a course within the course file modal
		vm.addCourse2 = function() {
			if (!$scope.addNewCourseInputSubject2 || !$scope.addNewCourseInputNumber2 || !$scope.addNewCourseInputSection2 || !$scope.addCourseTerm2 ||
				$scope.addNewCourseInputSubject2.length < 3 || $scope.addNewCourseInputNumber2.length < 4) {
				var errMsg = "";
				if (!$scope.addNewCourseInputSubject2)
					errMsg += "\tSubject Missing\n";
				else if ($scope.addNewCourseInputSubject2.length < 3)
					errMsg += "\tSubject is not 3 Character Code\n";
				if (!$scope.addNewCourseInputNumber2)
					errMsg += "\tNumber Missing\n";
				else if ($scope.addNewCourseInputNumber2.length < 4)
					errMsg += "\tNumber is not 4 Digit Number\n";
				if (!$scope.addNewCourseInputSection2)
					errMsg += "\tSection Missing\n";
				if (!$scope.addCourseTerm2)
					errMsg += "\tSemester Missing\n";

				swal({
                    title: "Error",
                    text: errMsg,
                    type: "error",
                    confirmButtonText: "Continue",
                    allowOutsideClick: true,
                    timer: 10000,
					}, function () {}
				);
			}

			else {
				// test if duplicate exists
				var courseName = $scope.addNewCourseInputSubject2 + ' ' + $scope.addNewCourseInputNumber2 + "-" + $scope.addNewCourseInputSection2;
				var found = false;
				vm.courses.forEach(function (course) {
					if (course.name == courseName && course.semester == $scope.addCourseTerm2.name)
						found = true;
                });
				if (!found) { // Create the new course and save it
					var newCourse = {
						name: courseName,
						subject: $scope.addNewCourseInputSubject2,
						number: $scope.addNewCourseInputNumber2,
						section: $scope.addNewCourseInputSection2,
						semester: $scope.addCourseTerm2.name,
						fullName: courseName + ' ' + $scope.addCourseTerm2.name
					};

					if($scope.addNewCourseInputTitle2 != "")
						newCourse["title"] = $scope.addNewCourseInputTitle2;

					adminService.addCourse(newCourse).then(function (data) {
						vm.courses.push(data);
						// Update course selection box
						$scope.syncCourseSelect = vm.courses[vm.courses.length-1];

						// Notify User of Added Course
						swal({
							title: "Success",
							text: "Course " + courseName + " has been added to the database",
							type: "success",
							confirmButtonText: "Continue",
							allowOutsideClick: true,
							timer: 10000,
							}, function () {}
						);
					});
					// Hide add course table
					$scope.showAddCourse = false;

					// Clear Input fields
					$scope.addNewCourseInputSubject2 = "";
					$scope.addNewCourseInputNumber2 = "";
					$scope.addNewCourseInputSection2 = "";
					$scope.addNewCourseInputTitle2 = "";
					$scope.addCourseTerm2 = "";
				}
			}
		};

		// Parse XLS file into readable data
		function parseXLS(file) {
			var entries = file.split('<tr>');
			var users = [];
			for (var i=2; i<entries.length; i++) {
				var entryData = entries[i].split('<td>');
				try {
					var pid = entryData[3].split('</td>');
					var email = entryData[4].split('</td>');
					var name = entryData[5].split('</td>');
					var nameTokens = name[0].split(',');
					var firstAndMidName = nameTokens[1].split(' ');
					var newUser = {
						pantherID: pid[0],
						email: email[0],
						firstName: firstAndMidName[0],
						lastName: nameTokens[0]
					};
					users.push(newUser);
				}
				catch (err) { /* Don't push data that cannot be parsed */ }
			}
            return users;
		};

		// Removes a course file from course file list
		vm.removeCourseFile = function(removingCourseFile) {
			vm.courseFiles.forEach(function (courseFile, index) {
				if (courseFile.course.fullName == removingCourseFile.course.fullName) {
					vm.courseFiles.splice(index, 1);
				}
			});
		};

		// Updates each course with its corresponding courseFile in the database
		vm.syncDatabase = function() {
			// Build map for users for fast lookup
			var userMap = new Map();
			vm.allusers.forEach(function (user, index) {
				userMap.set(user.email, index);
			});

			vm.courseFiles.forEach(function (courseFile, indexA) {
				// Map for users in this course file
				var courseEnrolled = new Map();

				courseFile.data.forEach(function (courseUser, indexB) {
					courseEnrolled.set(courseUser.email, indexB+1);
					// Determine if user exists already
					if (userMap.get(courseUser.email)) {
						// Determine if user needs to be updated
						var testUser = vm.allusers[userMap.get(courseUser.email)];
						var needUpdate = false;

						if (testUser.course != courseFile.course.name) {
							needUpdate = true;
						}
						if (testUser.isEnrolled != true) {
							needUpdate = true;
						}

						// Update the user in the database
						if (needUpdate) {
							testUser.course = courseFile.course.fullName;
							testUser.isEnrolled = true;
							User.update({user: testUser});
						}
					}
					else { // User doesn't exist, create a new user and add it to the database & user lists
						courseUser['course'] = courseFile.course.fullName;
						courseUser['isEnrolled'] = true;
						courseUser['semester'] = courseFile.course.semester;
						courseUser['piApproval'] = true;
						courseUser['adminCreated'] = true;
						courseUser['RegDate'] = DateTimeService.getCurrentDateTimeAsString();

						User.create(courseUser).then(function(data) {
							if (data) {
								if (data.data.success) {
									userMap.set(courseUser.email, vm.allusers.length);
									vm.allusers.push(data.data.object);
									// Refresh User panel
									vm.tabledata = JSON.stringify(vm.filteredusers);
									vm.tabledata = eval(vm.tabledata);
								}
							}
						});
					}
				});

				// Remove users that are no longer in this specific course
				vm.allusers.forEach(function (user, index) {
					if (!courseEnrolled.get(user.email)) {
						if (user.course == courseFile.course.fullName) {
							// Update the user in the database
							user.course = "";
							user.isEnrolled = false;
							User.update({user: user});
						}
					}
				});
			});
			// Refresh User panel
			vm.tabledata = JSON.stringify(vm.filteredusers);
			vm.tabledata = eval(vm.tabledata);
			// Clear the course file list
			vm.clearCourseFiles();

			swal({
				title: "Success",
				text: "Users database has been updated with the uploaded course file data",
				type: "success",
				confirmButtonText: "Continue",
				allowOutsideClick: true,
				timer: 10000,
				}, function () {}
			);
		};

		// Clears the course file list & resets input
		vm.clearCourseFiles = function() {
			vm.courseFiles = [];
			document.getElementById('syncCourseSelect').selectedIndex = -1;
			document.getElementById('courseFileInput').value = null;
			// Hide add course table
			$scope.showAddCourse = false;
			// Clear Input fields
			$scope.addNewCourseInputSubject2 = "";
			$scope.addNewCourseInputNumber2 = "";
			$scope.addNewCourseInputSection2 = "";
			$scope.addNewCourseInputTitle2 = "";
			$scope.addCourseTerm2 = "";
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

    function currentSwitch(e) {
      console.log(typeof e);
      vm.currentSwitchStatus = e;
    }

    function viewableSwitch(e) {
      console.log(typeof e);
      vm.viewableSwitchStatus = e;
    }

    function proposableSwitch(e) {
      console.log(typeof e);
      vm.proposableSwitchStatus = e;
    }

    function applicableSwitch(e) {
      console.log(typeof e);
      vm.applicableSwitchStatus = e;
    }

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
				term: findIndexTerm(vm.editingUser.semester),
				course: findIndexCourse(vm.editingUser.course)
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
			if (indexes.course != -1)
				$scope.editUserCourse = vm.courses[indexes.course];
			else
				document.getElementById("ddCourse").selectedIndex = -1;
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

		function findIndexCourse(course) {
			if (course)
				for (var i=0; i<vm.courses.length; i++)
                    if (vm.courses[i].fullName == course)
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
						newUser["project"] = $scope.addUserProject.title;
					if ($scope.addUserPIApproval)
						newUser["piApproval"] = $scope.addUserPIApproval.type;
					if ($scope.addUserCollege)
						newUser["college"] = $scope.addUserCollege.name;
					if ($scope.addUserCourse)
						newUser["course"] = $scope.addUserCourse.fullName;
					if ($scope.addUserType)
						newUser["userType"] = $scope.addUserType.name;
					if ($scope.addUserTerm)
						newUser["semester"] = $scope.addUserTerm.name;

					if (newUser.project)
						newUser["joined_project"] = true;
					else
						newUser["joined_project"] = false;

					newUser["isEnrolled"] = false;

					// Send POST request
					User.create(newUser).then(function(data) {
						if (data) {
							if (data.data.success) {
								document.getElementById('addUserMessage').innerHTML = 'Adding user was successful';
								vm.newUser = data.data.object;
								// Update the project if user is added to one
								if (newUser.project)
									addUserToProject(newUser);
							}
							else {
								document.getElementById('addUserMessage').innerHTML = 'Error: HTTP request failed';
							}
						} else { // http error
							document.getElementById('addUserMessage').innerHTML = 'Error: HTTP response not received';
						}
					});
				}
				else {
					if (!validateEmail($scope.addUserEmail)) {
						document.getElementById('addUserMessage').innerHTML = 'Error: Invalid Email Address';
					}
					else if (!validatePassword($scope.addUserPassword) || !validatePassword($scope.addUserPasswordConf)) {
						document.getElementById('addUserMessage').innerHTML = 'Error: Invalid Password';
					}
					else {
						document.getElementById('addUserMessage').innerHTML = 'Error: Mismatched Passwords';
					}
				}
			}
			else {
				document.getElementById('addUserMessage').innerHTML = 'Error: Missing required information';
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
					if ($scope.editUserCourse)
						vm.editingUser.course = $scope.editUserCourse.fullName;
					else
						vm.editingUser.course = null;


					if (vm.editingUser.project)
						vm.editingUser.joined_project = true;
					else
						vm.editingUser.joined_project = false;

					if (!vm.editingUser.isEnrolled)
						vm.editingUser["isEnrolled"] = false;

					// Send PUT request
					User.update({user: vm.editingUser}).then(function(data) {
						if (data) {
							if (data.data.success) {
								document.getElementById('editUserMessage').innerHTML = 'Editing user was successful';
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
								// Refresh user panel
								vm.tabledata = JSON.stringify(vm.filteredusers);
								vm.tabledata = eval(vm.tabledata);
							}
						} else { // http error
							document.getElementById('editUserMessage').innerHTML = 'Error: HTTP response not received';
							// Refresh user panel
							vm.tabledata = JSON.stringify(vm.filteredusers);
							vm.tabledata = eval(vm.tabledata);
						}
					});
				}
				else {
					document.getElementById('editUserMessage').innerHTML = 'Error: Invalid Email Address';
				}
			}
			else {
				document.getElementById('editUserMessage').innerHTML = 'Error: Missing required information';
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
					project.owner_name = profileName;
					project.owner_email = vm.editingUser.email;
				}

				project.members.forEach(function (memberEmail, index) {
					if (memberEmail == vm.editingUserOrig.email) {
						found = true;
						project.members_detailed[index] = profileName;
						project.members[index] = vm.editingUser.email;
					}
				});

				project.faculty.forEach(function (faculty, index) {
					if (faculty.email == vm.editingUserOrig.email) {
						found = true;
						project.faculty[index].name = profileName;
						project.faculty[index].email = vm.editingUser.email;
					}
				});

				project.mentor.forEach(function (mentor, index) {
					if (mentor.email == vm.editingUserOrig.email) {
						found = true;
						project.mentor[index].name = profileName;
						project.mentor[index].email = vm.editingUser.email;
					}
				});

				// Update project if associated with user
				if(found) {
					ProjectService.editProject(project, project._id);
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
						// Remove user from project if user was in one
						if (vm.deletingUser.project)
							removeUserFromProject(vm.deletingUser, vm.deletingUser.project, false);
					}
					else {
						document.getElementById('deleteUserMessage').innerHTML = 'Error: HTTP request failed';
						vm.deletingUser = null;
					}
				} else { // http error
					document.getElementById('deleteUserMessage').innerHTML = 'Error: HTTP response not received';
					vm.deletingUser = null;
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

			vm.editingProject = project;
			vm.editingProjOrigTitle = project.title;
			// Set initial values of input to be current projects values
			$scope.editPTitle = vm.editingProject.title;
			$scope.editPDescription = vm.editingProject.description;
			$scope.editPMaxStudents = vm.editingProject.maxStudents;

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
				}
				else if ($scope.editPMaxStudents < vm.editingProject.members.length) {
					document.getElementById('editProjectMessage').innerHTML = 'Error: Max Students should not be less than currently enlisted member count';
				}
				else if ($scope.editPStatus.type == 'Active' && vm.terms[findIndexTerm($scope.editPTerm.name)].status != 'Active') {
					document.getElementById('editProjectMessage').innerHTML = 'Error: Cannot set project to Active status in a non-active semester';
				}
				else { // Update editingProject
					vm.editingProject.title = $scope.editPTitle;
					vm.editingProjNewTitle = $scope.editPTitle;
					vm.editingProject.description = $scope.editPDescription;
					vm.editingProject.maxStudents = $scope.editPMaxStudents;

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

					// Send PUT request
					ProjectService.editProject(vm.editingProject, vm.editingProject._id).then(function(data) {
						if (data) {
							if (data.data.message == 'Updated!') {
                                document.getElementById('editProjectMessage').innerHTML = 'Editing project was successful';
                                sendDeactivationEmail();
								// Update users associated with this project if project title has changed
								if (vm.editingProjOrigTitle != vm.editingProjNewTitle)
									updateUsers();
							}
							else {
								document.getElementById('editProjectMessage').innerHTML = 'Error: HTTP request failed';
								// Refresh projects panel
								vm.tabledata_p = JSON.stringify(vm.filteredprojects);
								vm.tabledata_p = eval(vm.tabledata_p);
							}
						} else { // http error
							document.getElementById('editProjectMessage').innerHTML = 'Error: HTTP response not received';
							// Refresh projects panel
							vm.tabledata_p = JSON.stringify(vm.filteredprojects);
							vm.tabledata_p = eval(vm.tabledata_p);
						}
					});
				}
			}
			else {
				document.getElementById('editProjectMessage').innerHTML = 'Error: Missing required information';
			}

		};

		// User story #1238 - Update users associated with this project if project title has changed
		function updateUsers() {
			vm.allusers.forEach(function (user) {
				if (user.project == vm.editingProjOrigTitle) {
					user.project = vm.editingProjNewTitle;
					// Update the user with new project title
					User.update({user: user});
				}
			});
			// Refresh user panel
			vm.tabledata = JSON.stringify(vm.filteredusers);
			vm.tabledata = eval(vm.tabledata);
		};

		// User story #1329 - add and remove video urls from an editing project
		vm.addProjectVideo = function() {
			if ($scope.addPVidUrl) {
				var vidUrl = $scope.addPVidUrl;
				var processedVidUrl = ProcessVideoURL(vidUrl);
				var processedVidThumb = createThumbURL(processedVidUrl);
				var found = false;
				if(vm.editingProject.video_url == null) {
					vm.editingProject.video_url = [];
				}
				vm.editingProject.video_url.forEach(function (user, index) {
					if (vm.editingProject.video_url[index].vidurl == processedVidUrl)
						found = true;
				});
				if (!found)
					vm.editingProject.video_url.push({vidurl: processedVidUrl, vimgurl: processedVidThumb});
			}
			$scope.addPVidUrl = null;
		};

		vm.removeProjectVideo = function(video) {
			vm.editingProject.video_url.forEach(function (user, index) {
				if (vm.editingProject.video_url[index].vidurl == video.vidurl) {
					vm.editingProject.video_url.splice(index, 1);
				}
			});
		};

    function sendDeactivationEmail() {
            var email;
            if (vm.editingProject.status == 'Disabled') {
                for (i = 0; i < vm.editingProject.members.length; i++) {
                    email = vm.editingProject.members[i];
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
				var videoID = "";
				var updatedVideoURL = "";
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
        };

		function createThumbURL(VideoURL) {
			var videoID = "";
			var createdThumbURL = "";

			if (VideoURL.indexOf("&list=") > -1) {
				//console.log("Playlist Thumbnail")
				videoID = VideoURL.substr(VideoURL.indexOf("list=") + 5);
				createdThumbURL = "img/playlist.png";
				//console.log("Filtered url: " + updatedVideoURL);
				return createdThumbURL;
			}
			else {
				videoID = VideoURL.substr(VideoURL.indexOf("embed/") + 6);
				createdThumbURL = "http://img.youtube.com/vi/" + videoID + "/0.jpg";
				return createdThumbURL;
			}
		};


		vm.editProjectUsers = function(project) {
         var detailedApproval = []
         var promiseArr = []
         project.members.map(email=>{
            promiseArr.push(
               new Promise((resolve,reject)=>{
                  User.getByEmail(email).then((res)=>{
                     console.log(res)
                     User.get(res.data).then((user)=>{
                        resolve(user.data)
                        // let name = res.firstName + " " res.lastName
                        // detailedApproval.push({
                        //    name: name,
                        //    approved: approvalStat
                        // })
                     })
                  })
               })
            )

         })
         Promise.all(promiseArr).then(obj=>{
            //console.log(obj)
            obj.map(user=>{
               //console.log(user)
               name = user.firstName + " " + user.lastName
               var approved = false
               user.piProjectApproval ? approved = user.piProjectApproval : approved
               detailedApproval.push({
                  name: name,
                  id: user._id,
                  approved: approved
               })
            })
            //console.log(detailedApproval)
   			vm.editingProject = project;

            vm.editingProject.members_detailed_copy = detailedApproval
            //console.log(vm.editingProject)
   			vm.editingProjOrigMembers = Array.from(vm.editingProject.members);
            $scope.$digest();
         })
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
               var name = addStudent.firstName + ' ' + addStudent.lastName
					vm.editingProject.members_detailed_copy.push({
                  name: name,
                  approved: true
               });
					vm.editingProject.members.push(addStudent.email);
               vm.editingProject.members_detailed.push(addStudent.email);
				}
			}
         //console.log(vm.editingProject.members_detailed_copy)
		};

      vm.approveStudentProject = function(student){
         //console.log(student)
         adminService.approveProject(student).then((res)=>{
            //console.log(res)
            $timeout(function() {
            // We must reevaluate the value in case it was changed by a subsequent
            // watch handler in the digest.

            $scope.$digest()
          }, 0, false);
         })
      }
      vm.approveUser = function(user){
         //console.log(vm.tabledata)
         adminService.approveUser(user).then((res)=>{
            //console.log(res)
            $state.reload()
            $timeout(function() {
            // We must reevaluate the value in case it was changed by a subsequent
            // watch handler in the digest.

            $scope.$digest()
          }, 0, false);
         })
      }

      vm.unapproveUser = function(user){
         //console.log(vm.tabledata)
         adminService.unapproveUser(user).then((res)=>{
            //console.log(res)
            $state.reload()
            $timeout(function() {
            // We must reevaluate the value in case it was changed by a subsequent
            // watch handler in the digest.

            $scope.$digest()
          }, 0, false);
         })
      }
		vm.removeStudentProject = function(removingStudent) {
			// Remove student from project roster
         //console.log(removingStudent)
			for (i = 0; i < vm.editingProject.members.length; i++) {
				if (vm.editingProject.members_detailed_copy[i].name == removingStudent) {
					vm.editingProject.members.splice(i, 1);
					vm.editingProject.members_detailed.splice(i, 1);
               vm.editingProject.members_detailed_copy.splice(i, 1);
				}
			}
		};

		vm.editingProjectNew;

		// Update Project's users information
		vm.saveChangesProjectUsers = function() {
			// Send PUT request
			ProjectService.editProject(vm.editingProject, vm.editingProject._id).then(function(data) {
				if (data) {
					if (data.data.message == 'Updated!') {
						document.getElementById('editProjectMessage').innerHTML = 'Editing projects users was successful';

						vm.editingProjectNew = Array.from(vm.editingProject.members);
						updateProjectUsers(vm.editingProject.title, vm.editingProjectNew, vm.editingProjOrigMembers);
						// Refresh User Panel
						vm.tabledata = JSON.stringify(vm.filteredusers);
						vm.tabledata = eval(vm.tabledata);
					}
					else {
						document.getElementById('editProjectMessage').innerHTML = 'Error: HTTP request failed';
						// Refresh projects panel
						vm.tabledata_p = JSON.stringify(vm.filteredprojects);
						vm.tabledata_p = eval(vm.tabledata_p);
					}
				} else { // http error
					document.getElementById('editProjectMessage').innerHTML = 'Error: HTTP response not received';
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
					var pUser = vm.allusers[findIndexUser(projectMembers[i])];
					if (pUser) {
						pUser.project = project;
						pUser.joined_project = true;
						User.update({user: pUser});
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
					var pUser = vm.allusers[findIndexUser(formerProjectMembers[j])];
					if (pUser) {
						pUser.project = null;
						pUser.joined_project = false;
						User.update({user: pUser});
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
					if (data.message == 'successfully deleted!') {
						document.getElementById('deleteProjectMessage').innerHTML = 'Deleting project was successful';
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
					}
				} else { // http error
					document.getElementById('deleteProjectMessage').innerHTML = 'Error: HTTP response not received';
					vm.deletingProject = null;
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

		// User Story #1365

		vm.addFacultyProject = function() {
			if ($scope.addPFaculty) {
				var addFaculty = $scope.addPFaculty;
				var found = false;
				for (i = 0; i < vm.editingProject.faculty.length; i++)
					if (vm.editingProject.faculty[i].email == addFaculty.email) {
						found = true; break;
					}
				if (!found) { // Add faculty into project list if they are not already in the project
					vm.editingProject.faculty.push({
						name: addFaculty.firstName + ' ' + addFaculty.lastName,
						email: addFaculty.email
					});
				}
			}
		};

		vm.removeFacultyProject = function(faculty) {
			// Remove faculty from project faculty roster
			for (i = 0; i < vm.editingProject.faculty.length; i++) {
				if (vm.editingProject.faculty[i].email == faculty.email) {
					vm.editingProject.faculty.splice(i, 1);
				}
			}
		};

		vm.addMentorProject = function() {
			if ($scope.addPMentor) {
				var addMentor = $scope.addPMentor;
				var found = false;
				for (i = 0; i < vm.editingProject.mentor.length; i++)
					if (vm.editingProject.mentor[i].email == addMentor.email) {
						found = true; break;
					}
				if (!found) { // Add mentor into project list if they are not already in the project
					vm.editingProject.mentor.push({
						name: addMentor.firstName + ' ' + addMentor.lastName,
						email: addMentor.email
					});
				}
			}
		};

		vm.removeMentorProject = function(mentor) {
			// Remove mentor from project mentor roster
			for (i = 0; i < vm.editingProject.mentor.length; i++) {
				if (vm.editingProject.mentor[i].email == mentor.email) {
					vm.editingProject.mentor.splice(i, 1);
				}
			}
		};

        //Ravi's Help
        function AddTerms() {
            var termsdata = {
                name: "Fall 2017 Test",
                start: new Date('2017', '08'),
                end: new Date('2017', '12'),
                deadline: new Date('2017, 08'),
                active: true,
                status: "Active",
                open: true
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
            // User story 1345
            loadCourses();
        }

        vm.adminSettings;
        function loadSettings()
        {
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
                console.log(vm.terms);
                data.forEach(function(term) {
                  if(term.status.currentSemester == true){
                    vm.currentSem = term;
                    // vm.currentSemesterName.push(term.name); // TODO Remove if not needed
                    vm.currentSemesterName = term.name;
                  }
                })

            });
        }

		// Loads all courses & initializes course file list
        function loadCourses() {
            adminService.loadCourses().then(function (data) {
                vm.courses = data;

            });
			vm.courseFiles = [];
        }

        vm.uncheck = function () {

            for (var i = 1; i <= 18; i++) {
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
			// userstory #1352
			$scope.selectedCouse = '';
			$scope.selectedIsEnrolled = '';
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

		vm.uncheckc = function () {
			// userstory #1346
			for (var i = 1; i <= 3; i++) {
                $scope['queryc' + i] = '';
            }
			$scope.selectedCourseTerm = '';
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
                vm.message = "User has been Accepted!";

                // if a Pi is approved, mark him in the DB as a super user, so he can switch usertypes to student/faculty/pi without approval
                if (user.userType == "Pi/CoPi") {
                    user.isSuperUser = true;
                }

                // non-pi user must be restricted
                else {
                    user.isSuperUser = false;
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
                user.modifying = true;
                ProfileService.saveProfile(user).then(function (data) {
                    reviewProfileService.updateProfile(user).then(function (data) {
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
        swal( {
          title: "User Confirmed!",
          text: "User's account has been confirmed!",
          type: "info",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {
          $window.location.reload();
        } );
      };

      function Reject_msg() {
        swal( {
          title: "User Rejected!",
          text: "User's account has been deleted!",
          type: "info",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {
          $window.location.reload();
        } );
      };

      function delete_msg() {
        swal( {
          title: "User Deleted!",
          text: "User's account has been deleted!",
          type: "info",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {
          $window.location.reload();
        } );
      };


      function changeut_msg() {
        swal( {
          title: "Usertype Changed",
          text: "User's type has been changed!",
          type: "info",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {

        } );
      };

      function changepro_msg() {
        swal( {
          title: "User's Project Changed",
          text: "User's project has been changed!",
          type: "success",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {

        } );
      };

      function semesterchange_msg() {
        swal( {
          title: "Semester Properties have Changed",
          text: "",
          type: "success",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {

        } );
      };

      function semestercreate_msg() {
        swal( {
          title: "Semester has been Created",
          text: "",
          type: "success",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {

        } );
      };

      function semesterdelete_msg() {
        swal( {
          title: "Semester has been Deleted",
          text: "",
          type: "success",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {

        } );
      };

      function defaultsemester_msg() {
        swal( {
          title: "Default Semester has been updated!",
          text: "",
          type: "success",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {

        } );
      };

      function changestat_msg() {
        swal( {
          title: "Project Status Has Changed",
          text: "Project's status has been changed!",
          type: "info",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {

        } );
      };

      function changeclear_msg() {
        swal( {
          title: "User's Project Cleared",
          text: "User's project has been cleared!",
          type: "info",
          confirmButtonText: "Continue",
          allowOutsideClick: true,
          timer: 10000,
        }, function() {

        } );
      };

      function savesettings_msg() {
        swal( {
            title: "Admin Settings Saved",
            text: "Admin preferences have been saved!",
            type: "info",
            confirmButtonText: "Continue",
            allowOutsideClick: true,
            timer: 10000,
          },
          function() {}
        );
      };

        function test_msg(test) {
          swal({
            title: "This is a test, anddd: " + test,
          },
          function() {}
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
            if (term) {
                var selectedTermStatus = $scope.selectedTermStatus;
                if (selectedTermStatus == vm.active[0]) {
                    selectedTermStatus = 'Active';
                } else {
                    selectedTermStatus = 'Disabled';
                }
                console.log(vm.projects);
                for (i = 0; i < vm.projects.length; i++) {
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

      function createNewSemester( n, s, e ) {

        if( vm.currentSwitchStatus == null ) { vm.currentSwitchStatus = false; }
        if( vm.viewableSwitchStatus == null ) { vm.viewableSwitchStatus = false; }
        if( vm.applicableSwitchStatus == null ) { vm.applicableSwitchStatus = false; }
        if( vm.proposableSwitchStatus == null ) { vm.proposableSwitchStatus = false; }

        var termData = {
          name: n,
          start: new Date( s ),
          end: new Date( e ),
          active: true,
          status: {
            currentSemester: vm.currentSwitchStatus,
            viewable: vm.viewableSwitchStatus,
            openForProposal: vm.proposableSwitchStatus,
            openForApply: vm.applicableSwitchStatus
          }
        };
        ProjectService.createTerm( termData ).then( function( success ) {
          loadTerms();
          resetSemSettings();
          semestercreate_msg();
        }, function( error ) {} );
        $scope.selectedTerm = termData;
      }

      function setDefaultSemester (semester) {
        var term = semester;
        var user = vm.cuser;

        if ( term && user ) {

          user.selectedSemester = term;
          ProfileService.saveProfile(user);
          updateSelectedSemesterQueries(term.name);
          vm.defaultSemester = term.name;
          defaultsemester_msg();
        }
      }

      function editSemButton (semester) {
        vm.semesterToBeEdited = semester;
        if(semester) {
          $scope.semName = semester.name;
          $scope.startDate = semester.start;
          $scope.endDate = semester.end;
          vm.cStatus = semester.status.currentSemester;
          vm.vStatus = semester.status.viewable;
          vm.pStatus = semester.status.openForProposal;
          vm.aStatus = semester.status.openForApply;
          if(vm.currentSwitchStatus == null) { vm.currentSwitchStatus = semester.status.currentSemester; }
          if(vm.viewableSwitchStatus == null) { vm.viewableSwitchStatus = semester.status.viewable; }
          if(vm.proposableSwitchStatus == null) { vm.proposableSwitchStatus = semester.status.openForProposal; }
          if(vm.applicableSwitchStatus == null) { vm.applicableSwitchStatus = semester.status.openForApply; }
        }
      }

      function makeSemesterChanges() {
        var semester = vm.semesterToBeEdited;
        if ( semester ) {
          semester.name = $scope.semName;
          semester.start = $scope.startDate;
          semester.end = $scope.endDate;
          semester.status.currentSemester = vm.currentSwitchStatus == 'true' ? true : false;
          semester.status.openForApply = vm.applicableSwitchStatus == 'true' ? true : false;
          semester.status.openForProposal = vm.proposableSwitchStatus == 'true' ? true : false;
          semester.status.viewable = vm.viewableSwitchStatus == 'true' ? true : false;
          ProjectService.editTerm( semester, semester._id );
          // vm.currentSem = selectedSemester;
          // vm.currentSemesterName = vm.currentSem.name;
        }
        semesterchange_msg();
        resetSemSettings();
      }

      function delSemButton (semester) {
        vm.semesterToBeDeleted = semester;
        console.log(vm.semesterToBeDeleted);
      }

      function deleteSemester() {
        var term = vm.semesterToBeDeleted;

        if ( term ) {
          ProjectService.deleteTerm( term._id ).then( function( success ) {
            console.log( "Successfully Deleted Semester" );
            delete $scope.selectedTerm;
            loadTerms();
            semesterdelete_msg();
          }, function( error ) {} );
        }
      }

      function resetSemSettings() {
          delete $scope.semName;
          delete $scope.startDate;
          delete $scope.endDate;
          delete $scope.cStatus;
          delete $scope.vStatus;
          delete $scope.pStatus;
          delete $scope.aStatus;
          // delete vm.cStatus;
          // delete vm.vStatus;
          // delete vm.pStatus;
          // delete vm.aStatus;
          delete vm.currentSwitchStatus;
          delete vm.viewableSwitchStatus;
          delete vm.proposableSwitchStatus;
          delete vm.applicableSwitchStatus;
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
