(function() {
    angular.module('toDoModule')
    .factory('ToDoService', toDoFactory);

    function toDoFactory ($http) {
        // create a new object
        var toDoFactory = {};

        toDoFactory.loadAllToDo = function () {
            return $http.get('/todo/todo');
        };

        toDoFactory.loadMyToDo = function(profile)
        {

            if (profile.userType ==="Pi/CoPi")
                return $http.get('/todo/todo/pi/' + profile._id);
            else
                return $http.get('/todo/todo/my/' + profile._id);

        };

        toDoFactory.loadMyToDoType = function(profile, type)
        {
            if (profile.userType === "Pi/CoPi")
                return $http.get('/todo/todo/pi/' + profile._id + '/' + type);
            else
                return $http.get('/todo/todo/my/' + profile._id + '/' + type);
        };

        toDoFactory.markAsRead = function (id) {
            return $http.post('/todo/todo/' + id);
        };

        toDoFactory.createTodo = function (todo) {
            return $http.post('todo/todo', todo);
        };

        return toDoFactory;
    }
}());
