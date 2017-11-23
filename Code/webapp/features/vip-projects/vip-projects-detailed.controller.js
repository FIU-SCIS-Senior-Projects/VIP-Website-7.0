(function () {
    'use strict';

    angular
        .module('vip-projects')
        .controller('VIPProjectsDetailedCtrl', VIPProjectsDetailedCtrl);

    VIPProjectsDetailedCtrl.$inject = ['$sce', '$location', '$state', '$scope', '$stateParams', 'ProjectService', 'ProfileService', 'reviewStudentAppService', 'User', '$window'];

    /* @ngInject */
    function VIPProjectsDetailedCtrl($sce, $location, $state, $scope, $stateParams, ProjectService, ProfileService, reviewStudentAppService, User, $window) {
        var profile = null;
        var vm = this;
        vm.data = null

        vm.productOwner = new Array();

        // array that stores the names of product owners
        vm.own = [];

        vm.profile;
        vm.projects;
        vm.applyForProject = applyForProject;
        vm.deleteProject = deleteProject;
        vm.editProject = editProject;
        vm.leaveProject = leaveProject;
        //vm.findProfile = findProfile;
        vm.already_joined = null;
        $scope.personLimit = 5;
        vm.not_signed_in = false;
        $scope.iFrameURL = null;
        vm.toggleLimit = function (url) {
            if ($scope.personLimit == 5) {
                $scope.personLimit = 256;
            }
            else {
                $scope.personLimit = 5;
            }
        }
        vm.setVideo = function (url) {

            $scope.iFrameURL = $sce.trustAsResourceUrl(url);
        }
        vm.openPDF = function (pdfUrl) {
            if (pdfUrl.startsWith("data:application")) {
                var start_pos = pdfUrl.indexOf(':') + 1;
                var end_pos = pdfUrl.indexOf(';',start_pos);
                var typeString = pdfUrl.substring(start_pos,end_pos);
                //console.log("Type" + text_to_get);
                var base64data = pdfUrl.split("base64,");
                //console.log("Base 64" + base64data[1]);

                var pdfBlob = b64toBlob(base64data[1], typeString);
                var blobUrl = URL.createObjectURL(pdfBlob);
                //console.log("Blob URL \n" + blobUrl);

                window.open(blobUrl, "_blank");
            }
            else {
                window.open(pdfUrl, "_blank");
            }
        }

        vm.getEmail = function (index) {
            return vm.data.members[index];
        }

        vm.redirect = function (index) {

            User.getByEmail(vm.data.members[index]).then(function (res) {
                $state.go('viewProfile', {user_id: res.data, project_id: vm.data._id});
            });
        }

        vm.redirect2 = function (email) {

            User.getByEmail(email).then(function (res) {
                $state.go('viewProfile', {user_id: res.data, project_id: vm.data._id});
            });
        }

        $scope.go = function (path) {
            alert(path);
            $location.path(path);
        };


        //init();
        //function init(){
        if ($stateParams.id != null) {

            vm.id = $stateParams.id;
            getProjectById();

        }
        ProfileService.loadProfile().then(function (data) {
            vm.profile = data;

            reviewStudentAppService.loadAllProjects().then(function (data) {
                vm.projects = data;
            });

        });
        //}           


        function getProjectById() {
            ProjectService.getProject(vm.id).then(function (data) {
                if (data.old_project && data.old_project.length > 0) {
                    vm.data = data.old_project[0];
                    console.log(vm.data.owner_name);
                    vm.own = vm.data.owner_name.split(', ');
                    vm.own.mail = vm.data.owner_email.split(', ');
                    console.log(vm.own);
                    //vm.own_mails = 
                }
                else {
                    vm.data = data;
                    //console.log("" + vm.data.video_url[0].vidurl);
                    if (vm.data.video_url.length > 0) {
                      if (vm.data.video_url[0])
                        $scope.iFrameURL = $sce.trustAsResourceUrl(vm.data.video_url[0].vidurl);
                      else
                        $scope.iFrameURL = null;
                    }
                    console.log(vm.data.owner_name);

                    vm.own = vm.data.owner_name.split(', ');
                    vm.newmail = vm.data.owner_email.split(', ');

                    var xlength = vm.own.length;
                    for (var i = 0; i < xlength; i++) {
                        vm.productOwner.push([vm.own[i], vm.newmail[i]]);
                    }

                    console.log("Productowner array: ");
                }
                ProfileService.loadProfile().then(function (data) {
                    profile = data;
                    if (profile) {
                        if (vm.data.members) {
                            vm.already_joined = vm.data.members.includes(profile.email);
						}
                        else {
                            vm.already_joined = false;
                        }
                        console.log(vm.already_joined);
                    }
                    else {
                        vm.already_joined = false;
                        vm.not_signed_in = true;
                    }
                });
            })
        }

        function applyForProject() {
            // guest user should be told to login before applying to join a project
            if (!vm.profile) {
                swal({
                    title: "Dear Guest!",
                    text: "Please Login/Register before Applying to Join a Project!",
                    type: "info",
                    confirmButtonText: "Okay",
                    showCancelButton: true,
                }, function () {
                    //alert(1);
                    $window.location.href = "/#/login";
                });
            }
            else if (vm.data.status == 'Disabled') {

                swal({
                    title: "Dear Student!",
                    text: "This Project is no longer active, please apply to an active project",
                    type: "info",
                    confirmButtonText: "Okay",
                    showCancelButton: true,
                }, function () {
                    //alert(1);
                    $window.location.href = "/#/vip-projects";
                });
            }
            // all other users are allowed
            else {
                $state.go('studentconfirminfo', {id: vm.id});
            }
        }


        function leaveProject() {
            swal({
                title: "You're about to leave this project!",
                text: "Are you sure you want to leave this project?",
                type: "warning",
                confirmButtonText: "I'm sure",
                showCancelButton: true,
            }, function () {
				// US 1328 - Update Users in project being removed
                profile.joined_project = false;
				profile.project = null;
                User.update({user: profile});
                reviewStudentAppService.RemoveFromProject(vm.id, profile.email, profile.firstName + " " + profile.lastName);
                $window.location.reload();
            });
        }

        function deleteProject() {
            if (vm.profile) {
                swal({
                    title: "You're about to delete this project!",
                    text: "Are you sure you want to delete this project?",
                    type: "warning",
                    confirmButtonText: "I'm sure",
                    showCancelButton: true,
                }, function () {
                    if (vm.profile._id == vm.data.owner || vm.profile.userType == "Pi/CoPi") {
						var allusers;
						// US 1328 - Update Users in project being removed
						User.loadAllUsers().then(function (data) {
							allusers = data;
							allusers.forEach(function (user, index) {
								if (user.project == vm.data.title) {
									user.joined_project = false;
									user.project = null;
									User.update({user: user});
								}
							});
						});
                        ProjectService.delete(vm.id).then(function (data) {
                            //console.log("Returned from the BackEnd");
                            $location.path('vip-projects');
                        });
                    }
                    else {
                        deny_msg();
                    }
                });
            }
            else {
                deny_msg();
            }
        }

        // function findProfile(name) {
        //    console.log(name);

        // }

        function editProject() {
            if (vm.profile) {
                if (vm.profile._id == vm.data.owner || vm.profile.userType == "Pi/CoPi") {
                    $state.go('projectProposal', {id: vm.id});
                }
                else {
                    deny_msg();
                }
            } else {
                deny_msg();
            }
        }


        function deny_msg() {
            swal({
                title: "You can't do that",
                text: "You don't have permissions to perform this action.",
                type: "info",
                confirmButtonText: "Ok",
            });
        }

        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
          
            var byteCharacters = atob(b64Data);
            var byteArrays = [];
          
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
              var slice = byteCharacters.slice(offset, offset + sliceSize);
          
              var byteNumbers = new Array(slice.length);
              for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
          
              var byteArray = new Uint8Array(byteNumbers);
          
              byteArrays.push(byteArray);
            }
          
            var blob = new Blob(byteArrays, {type: contentType});
            return blob;
          }
    }
})();
