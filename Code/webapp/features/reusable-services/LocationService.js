(function () {
    angular.module('vip-projects')
        .factory('LocationService', function ($location) {
            var locationService = {};
            locationService.getBaseUrl = function () {
                return $location.protocol() + "://" + $location.host() + ":" + $location.port();
            };
            locationService.getAbsoluteUrl = function (path) {
                return locationService.getBaseUrl() + path;
            };
            locationService.vipWebUrls = {
                home: locationService.getAbsoluteUrl("/#"),
                reviewUser: locationService.getAbsoluteUrl("/#/reviewuser"),
                reviewProject: locationService.getAbsoluteUrl("/#/reviewproject"),
                sendMessage: locationService.getAbsoluteUrl("/#/sendmessage"),
                verifyUser: locationService.getAbsoluteUrl("/#/verifyuser"),
                projectDetailed: locationService.getAbsoluteUrl("/#/vip-projects-detailed")
            };
            locationService.vipApiUrls = {
                login: locationService.getAbsoluteUrl("/login"),
                vip: {
                    verifyEmail: locationService.getAbsoluteUrl("/vip/verifyEmail")
                },
            };
            return locationService;
        });
}());