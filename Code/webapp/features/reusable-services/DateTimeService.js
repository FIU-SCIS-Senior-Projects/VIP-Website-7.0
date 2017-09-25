(function() {
    angular.module('vip-projects')
        .factory('DateTimeService', function () {


            var toDateObject = function(dateString)
            {
                var parsed = Date.parse(dateString);
                return new Date(parsed);
            };
            var toDayCount = function(timeEllapsed_ms)
            {
                var date = timeEllapsed_ms;
                var mill_to_sec = 1000;
                var sec_to_min = 60;
                var min_to_hour = 60;
                var hour_to_day = 24;

                var millisec_in_day = mill_to_sec * sec_to_min * min_to_hour * hour_to_day;
                var result = date/millisec_in_day;

               //console.log(result);
                return result;
            };


            // create a new object
            var dateTimeService = {};

            dateTimeService.getCurrentDateTimeAsString = function () {
                var d = new Date();
                var date = d.getDate();
                var month = d.getMonth() + 1;
                var year = d.getFullYear();
                var hours = d.getHours();
                var min = d.getMinutes();
                var sec = d.getSeconds();
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12;
                min = min < 10 ? '0' + min : min;
                return month + "/" + date + "/" + year + " " + hours + ":" + min + ":" + sec + ' ' + ampm;
            };

            dateTimeService.DateTimeEquals = function(date_str1, date_str2)
            {
                var date1 = toDateObject(date_str1);
                var date2 = toDateObject(date_str2);

                var diffInMilli = Math.abs( date1.getTime() - date2.getTime());

                if (diffInMilli <= 20000)
                    return true;
                else
                    return false;
            };

            dateTimeService.DaysElapsed = function(date_str)
            {
                var date = toDateObject(date_str).getTime();
                var today = (new Date()).getTime();
                var difference = today-date;

                // console.log(date);
                // console.log(today);
                //console.log(difference);

                return toDayCount(difference);

            };

            return dateTimeService;
        });
}());