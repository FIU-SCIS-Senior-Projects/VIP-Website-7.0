var Log	    = require('../models/log');
var authProvider = require('../services/AuthorizationProvider');

module.exports = function(app, express) {
    var apiRouter = express.Router();

    apiRouter.route('/log')
        .get(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi, authProvider.userType.StaffFaculty]),
            function (req, res) {
            Log.find({}, function(err, log) {
                if(err) {
                    res.send('There was an error processing');
                } else {
                    res.send(log);
                }
            });
        })
        .post(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
            Log.create(req.body, function( err) {
                if(err) {
					console.log(err);
                    return res.send('something went wrong');
                } else {
                    res.send('Log added');
                }
            });
        });

    apiRouter.route('/log/:id')//this method is never used so i'm not sure who should be able to use it
        .post(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi, authProvider.userType.StaffFaculty]),
            function (req, res) {
            Log.findOne({_id:req.params.id}, function(err, log) {
                if(err) {
                    res.send('There was an error processing');
                } else {
                    log.read = true;
                    log.save();
                    res.send('read');
                }
            });
        })
		.delete(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi, authProvider.userType.StaffFaculty]),
		    function (req, res) {
            Log.remove({_id: req.params.id}, function(err, log){
            if(err)
                res.send(err);
                res.json({message: 'successfully deleted!'});
            });
        });
		
	apiRouter.route('/log/:type')
        .get(
            authProvider.authorizeByUserType([authProvider.userType.PiCoPi, authProvider.userType.StaffFaculty]),
            function (req, res) {
            Log.find({type: req.params.type}, function(err, log) {
                if(err) {
                    res.send('There was an error processing');
                } else {
                    res.send(log);
                }
            });
        });

    return apiRouter;
};
