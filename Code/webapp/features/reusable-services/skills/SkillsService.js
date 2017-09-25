(function () {
    angular.module('vip-projects')
        .factory('SkillsService', function ($http) {
            return {
                retrieveSkills: function() {
                    return $http.get('/api/skills').then(function (response) {
                        return response.data;
                    }, function(error) {
                        return [];
                    });
                },
                /**
                 *
                 * @returns contains the new list of skills including the ones just saved
                 */
                saveSkills: function(skills) {
                    return $http.post('/api/skills', { skills: skills }).then(function (response) {
                        return response.data;
                    }, function(error) {
                        return skills;//if failed to save, keep the old list
                    });
                }
            };
        });
}());
