(function() {
    angular.module('vip-projects')
        .directive('skills', function(SkillsService) {
            return {
                templateUrl: 'features/reusable-services/skills/SkillsTemplate.html',
                restrict: 'E',
                scope: { skills: "=" },
                controllerAs: 'skillsController',
                controller: function($attrs, $scope, $timeout) {
                    var vm = this;
                    vm.label = $attrs.label;
                    $scope.skills = $scope.skills ? $scope.skills : "";

                    vm.allowedSkills = function(skill) {
                        return skill.toLowerCase().startsWith(!$scope.skills ? "" : $scope.skills.split(',').pop().trim().toLowerCase())
                            && !(vm.currentSkills.map(function(skill) {
                                return skill.trim().toLowerCase();
                            }).includes(skill.trim().toLowerCase()));
                    };
                    vm.hideDropdown = function() {
                        $timeout(function() {
                            vm.showDropdown = false;
                        }, 1000);
                    };
                    vm.addSkill = function(skill) {
                        if (vm.currentSkills.length > 0 &&
                            skill.toLowerCase().startsWith(vm.currentSkills[vm.currentSkills.length - 1].trim().toLowerCase())) {
                            vm.currentSkills.pop();
                        }
                        vm.currentSkills.push(skill.trim());
                        $scope.skills = vm.currentSkills.join(', ') + ", ";
                    };
                    vm.populateSkills = function() {
                        if (!$scope.skills) {
                            vm.currentSkills = [];
                        } else {
                            var skills = $scope.skills.split(',');
                            var last = skills.pop();
                            skills = skills.map(function(skill) { return skill.trim(); })
                                .filter(function(skill) { return skill !== "" });
                            vm.currentSkills = skills;
                            $scope.skills = vm.currentSkills.join(', ');
                            vm.currentSkills.push(last);
                            if (vm.currentSkills.length === 1) {
                                $scope.skills = last;
                            } else {
                                $scope.skills += "," + last;
                            }
                        }
                    };
                    vm.currentSkills = [];

                    SkillsService.retrieveSkills().then(function(skills) {
                        vm.skillsList = skills;
                    });
                }
            }
        });
})();