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
        vm.orderBy = "title";
        vm.semesters = ['Fall', 'Spring', 'Summer'];
        
        /*Function Declarations*/

        //Generates an array for 'year' dropdown; [current year-10, current year+5]
        vm.getYearArry = function() {

            let year = new Date().getFullYear();
            var yearArr = new Array();
            var j = 0;

            for(var i = year - 10; i < year + 5; i++) {
                yearArr[j++] = i.toString();
            }
            console.log(yearArr);
            return yearArr;
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
    

        // vm.projects.forEach(function(element) {
        //     vm.disciplines = element.push();
        //     console.log(vm.disciplines);
        // });       
    }
})();