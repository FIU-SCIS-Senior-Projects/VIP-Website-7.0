var Course = require('../models/courses');
var authProvider = require('../services/AuthorizationProvider');

module.exports = function (app, express) {
    var apiRouter = express.Router();
	
	apiRouter.route('/courses')
		.post( // Add a new course
			authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                Course.create(req.body, function (err, course) {
                    if (err) {
                        return res.send('Error found');
                    } else {
                        res.json(course);
                    }
                });
            }
		)
		.get( // Get all courses
			authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                Course.find({}, function (err, courses) {
                    if (err) {
                        return res.send(err);
                    }
                    return res.json(courses);
                });
            }
		);
		
	apiRouter.route('/courses/:id')
		.get( // Find a course
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                Course.findById(req.params.id, function (err, course) {
                    if (err)
                        return res.send(err);
                    res.json(course);
                });
            })
        .put( // Update a course
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                 Course.findById(req.params.id, function (err, course) {
                    if (err) {
                        res.status(400);
                        res.send(err);
                    }
					
					course.name = req.body.name;
					course.subject = req.body.subject;
					course.number = req.body.number;
					course.section = req.body.section;
					course.semester = req.body.semester;
					course.title = req.body.title;
                    
                    course.save(function (err) {
                        if (err) {
                            res.status(400);
                            return res.send(err);
                        }
                        res.json({message: 'Updated!'});
                    });
                });
            })
        .delete( // Delete a course
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                Course.remove({_id: req.params.id}, function (err, course) {
                    if (err)
                        return res.send(err);
                    res.json({message: 'successfully deleted!'});
                });
            });
			
	return apiRouter;
}