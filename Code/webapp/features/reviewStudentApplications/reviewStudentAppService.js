(function() {
    angular.module('reviewStudentApp')
        .factory('reviewStudentAppService', userService);

    function userService($http) {
        // create a new object
        var profileFactory = {};

        profileFactory.loadProfile = function (email) {
            return $http.get('/api/reviewuser/'+email).then(function (data) {
                  console.log(data)
                return data.data;
            });
        };

        profileFactory.loadProjects = function () {
            return $http.get('/api/projects/').then(function (data) {
                console.log(data.data);
                return data.data;
            });
        };

		// Get projects from every semester
		profileFactory.loadAllProjects = function () {
            return $http.get('/api/projects/findall').then(function (data) {
                console.log(data.data);
                return data.data;
            });
        };

		// Changed Term API
        profileFactory.loadTerms = function () {
            return $http.get('/api/terms/findall').then(function (data) {
                return data.data;
            });
        };
        //Gets the individual member
        profileFactory.loadUser = function (id) {
            return $http.get('/api/profilestudent/' + id).then(function (data) {
                return data.data;
            });
        };
        profileFactory.addterm = function (termdata) {
            return $http.post('/api/terms', termdata);
            return data.data;
        };
        profileFactory.setJoinedProjectFalse = function (id) {
            return $http.put('/api/profilejoinedproject/' + id).then(function (data) {
                return data.data;
            });
        };

        profileFactory.RemoveFromProject = function (id, members, detailed) {
            return $http.put('/api/project/' + id + '/' + members + '/' + detailed).then(function (data) {
                return data.data;
            });
        };

        profileFactory.AddToProject = function (userid, pid) {
            return $http.put('/api/reviewusers/' + userid + '/' + pid).then(function (data) {
                return data.data;
            });
        };

        return profileFactory;
    }
}());
