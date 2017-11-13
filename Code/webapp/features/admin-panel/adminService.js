(function() {
    angular.module('admin')
        .factory('adminService', adminService);

    function adminService($http, LocationService) {
        // create a new object
        var adminFactory = {};

        adminFactory.loadAllUsers = function () {
            return $http.get('/api/getallusers/').then(function (data) {

                console.log("in loadAllUsers");
                return data.data;
            });
        };

        adminFactory.getAllSettings = function()
        {
            return $http.get('/settings/allsettings/').then(function (data)
            {
                console.log("in getSettings");
               return data.data;
            });
        };

        adminFactory.getAdminSettings = function()
        {
            return $http.get('/settings/admin').then(function (data)
            {
                console.log("In getAdminSettings");
                return data.data;

            });
        };

        adminFactory.saveAdminSettings = function(settings)
        {
            return $http.put('/settings/admin', settings).then(function (data)
            {
                return data.data;

            });
        };

        adminFactory.makeInitialSettings = function()
        {
            var settingsData = new Object();
            settingsData.owner = "admin";
            settingsData.current_email = "vip@cis.fiu.edu";
            settingsData.emails = [settingsData.current_email];
            settingsData.emailSignature = "Sincerely,<br/>VIP Admin,<br/>Masoud Sadjadi";
            console.log("in adminFactory makeInitSettings");

            return $http.post('/settings/settings', settingsData);
        };

        adminFactory.deleteSettings = function(id)
        {
            return $http.delete('/settings/settings/' + id).then(function (data)
            {
                console.log("Settings deleted.");
            });
        };
        adminFactory.impersonate = function(user) {
            return $http.post(LocationService.vipApiUrls.login, { email: user.email }).then(function (response) {
                return response.data;
            }, function(response) {
                return response.data;
            });
        };
        adminFactory.approveProject = function(user){
           console.log(user)
           return $http.put('/vip/usersUpdate/approveProject/'+user).then((res)=>{
             console.log(res)
             return res
          })
        }
        adminFactory.approveUser = function(user){
           return $http.put('/vip/usersUpdate/approveUser/'+user).then((res)=>{
             console.log(res)
             return res
          })
        }
        adminFactory.unapproveUser = function(user){
           return $http.put('/vip/usersUpdate/unapproveUser/'+user).then((res)=>{
             console.log(res)
             return res
          })
        }
        return adminFactory;
    }

}());
