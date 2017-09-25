//todo: why is there this much commented code here

/* var ToDo	= require('../models/todo'); <--this line goes on top

 var todo = new ToDo();
 todo.owner = Type of account that will see the todo or the specific account id
 todo.id = Optional if you  want to send the todo to a specific account id.
 todo.todo = the title of the app;
 todo.type = type of todo, needs to be hard coded based upon tasks
 acceptable values - CASE SENSITIVE!:
 personal   ---- profile needs
 user       ---- for co-pi approval
 project    ---- proposal review
 student    ---- for application review
 todo.link = your unique link;
 ToDo.create(todo, function(err) {
 if(err) {
 return res.send('error');
 } else {
 res.send('to do added');
 }
 });
 */

var ToDo = require('../models/todo');
var authProvider = require('../services/AuthorizationProvider');

module.exports = function (app, express) {

    var apiRouter = express.Router();

    apiRouter.route('/todo')
        .get(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {//todo: this is awful design, why would you retrieve every single record in the database, huge performance issue.
                ToDo.find({}, function (err, todo) {
                    if (err) {
                        res.send('There was an error processing the tasks');//todo: missing error code
                    } else {
                        res.send(todo);
                    }
                });
            })
        .post(
            authProvider.authorizeAll,
            function (req, res) {
                ToDo.create(req.body, function (err) {
                    if (err) {
                        return res.send('something went wrong');
                    } else {
                        res.send('to do added');
                    }
                });
            });

    apiRouter.route('/todo/:id')
        .post(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                ToDo.findOne({_id: req.params.id}, function (err, todo) {
                    if (err) {
                        res.send('There was an error processing the tasks');
                    } else {
                        todo.read = true;
                        todo.save();
                        res.send('read');
                    }
                });
            });

    apiRouter.route('/todo/my/:owner_id')
        .get(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                ToDo.find({owner_id: req.params.owner_id}, function (err, todo)
                {
                    if (err) {
                        res.send('There was an error processing the tasks');//todo: missing error code
                    } else {
                        res.send(todo);
                    }
                });
            });

    apiRouter.route('/todo/my/:owner_id/:type')
        .get(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                ToDo.find({owner_id: req.params.owner_id, type: req.params.type}, function (err, todo)
                {
                    if (err) {
                        res.send('There was an error processing the tasks');//todo: missing error code
                    } else {
                        res.send(todo);
                    }
                });
            });

    apiRouter.route('/todo/pi/:owner_id')
        .get(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                ToDo.find( { $or:[{owner: "Pi/CoPi", owner_id: null}, {owner_id: req.params.owner_id}]}, function (err, todo)
                {
                    if (err) {
                        res.send('There was an error processing the tasks');//todo: missing error code
                    } else {
                        res.send(todo);
                    }
                });
            });

    apiRouter.route('/todo/pi/:owner_id/:type')
        .get(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                ToDo.find( {$or:[{owner: "Pi/CoPi", owner_id: null}, {owner_id: req.params.owner_id}], type: req.params.type} , function (err, todo)
                {
                    if (err) {
                        res.send('There was an error processing the tasks');//todo: missing error code
                    } else {
                        res.send(todo);
                    }
                });
            });

    return apiRouter;
};
