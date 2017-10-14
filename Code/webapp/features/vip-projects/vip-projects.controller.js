(function () {
    'use strict';

    angular
        .module('vip-projects')
        .controller('VIPProjectsCtrl', VIPProjectsCtrl);

    VIPProjectsCtrl.$inject = ['$state', '$scope', 'ProjectService'];

    /* @ngInject */
    function VIPProjectsCtrl($state, $scope, ProjectService) {

        //Variable Declarations
        var vm = this;
        vm.projects;
        vm.done = false;
        vm.title = "title";
        vm.semsters = ['Fall', 'Spring', 'Summer'];
        vm.semester_year = vm.semester_model + " " + vm.semester_year;

        //Function Declarations
        vm.getYearArry = function() {

            let year = new Date().getFullYear();
            var yearArr = new Array();
            var j = 0;

            for(var i = year - 10; i < year + 5; i++) {
                yearArr[j++] = i;
            }
            console.log(yearArr);
            return yearArr;
        }

        vm.pastProjects = function() {
            ProjectService.getProjectsByTerm("Spring 2017").then(function(data){ 
                vm.projects = data;
                console.log(data);
            })
            
          }

          vm.getProjects = function() {
            ProjectService.getProjects().then(function(data){ 
                vm.projects = data;
                vm.done = true;
                console.log(data);
            })
            
          }        
             
        function viewDetails (data) {
            $state.go('projectsDetailed',{id: data._id});
        }

        vm.years = vm.getYearArry();

    }
})();