(function() {
    angular.module('toDoModule')
    .filter('picker',function($filter){

   })
    .controller('toDoController', toDoController);

    toDoController.$inject = ['$rootScope','$scope','ToDoService','ProfileService', 'DateTimeService'];

    function toDoController ($rootScope,$scope,ToDoService,ProfileService,DateTimeService) {

        var vm = this;
        vm.done = false;
        vm.list = [];
        vm.keywordFilter = {keyword:''}

        // Combo-box options for clearing to-do messages
        vm.clearOptions = ["...", "Older than a week", "Older than a month", "All"];
        $scope.clearOption =  {option: vm.clearOptions[0]};

        // "category" object defintion, used to keep track of the
        // "type" attribute belonging to the to-do collection
        function category(tname, theader, tcount)
        {
            this.typeName = tname;
            this.headerText = theader;
            this.count = tcount;
        }

        vm.personalCat = new category('personal', 'General Messages', 0);
        vm.userCat = new category('user', 'User Account Registration Review', 0);
        vm.projectCat = new category('project', 'Project Proposal Review', 0);
        vm.studentCat = new category ('student', 'Student Application Review', 0);
        vm.messageCat = new category('message', 'Email Messages', 0);

		vm.categories = [vm.messageCat, vm.personalCat, vm.userCat,
           vm.studentCat, vm.projectCat];

		// load user data
        ProfileService.loadProfile().then(function(data)
        {
            if (data) { getToDo(data); }
            else {vm.done = true;}
        });

        // retrieve to-dos
        function getToDo (profile) {

            ToDoService.loadMyToDo(profile)
                .then(function(data) {

                    vm.list = data.data;
                    for(i = 0; i < vm.list.length; i++)
                    {
                        //console.log(vm.list[i].owner_id );
                        if(vm.list[i].read) continue;

                        vm.categories.forEach( function(catItem)
                        {
                            if (vm.list[i].type == catItem.typeName)
                                catItem.count++;
                        });
                    }

                    vm.done = true;});
        }

        vm.markedAsRead = function(todo)
        {
            ToDoService.markAsRead(todo._id)
                .then(function(data) {
                    todo.read = true;
                    $rootScope.$broadcast('refresh');
                });

            vm.categories.forEach( function(catItem)
            {
                if (vm.list[i].type == catItem.typeName) {
                    catItem.count--;
                }
            });
        };

        vm.getTotalCount = function()
        {
            var total = 0;
            vm.categories.forEach( function(catItem)
            {
                var obj = catItem;
                total += obj.count;
            });
            return total;
        };

        vm.clearButton = function(catItem)
        {
            //console.log(catItem);
            var whichOpt = $scope.clearOption.option;
            var limit = 9999;

            //console.log(whichOpt);

            if (whichOpt === null || whichOpt === vm.clearOptions[0])
                return;
            else if (whichOpt === vm.clearOptions[1])
                limit = 7;
            else if (whichOpt === vm.clearOptions[2])
                limit = 30;
            else
                limit = 0;

            for(i = 0; i < vm.list.length; i++)
            {
                    if (vm.list[i].type == catItem.typeName)
                    {
                        var daysElapsed =  DateTimeService.DaysElapsed(vm.list[i].time);

                        if (daysElapsed > limit && !vm.list[i].read) {

                            vm.markedAsRead(vm.list[i]);
                            //vm.list[i].read = true;
                            //catItem.count--;
                        }

                    }
            }
        };
    }
}());
