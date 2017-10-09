var Term = require('../models/terms');
var authProvider = require('../services/AuthorizationProvider');

module.exports = function (app, express) {
    var apiRouter = express.Router();

	apiRouter.route('/terms')
		.post(
			authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                Term.create(req.body, function (err) {
                    if (err) {
                        return res.send('Error found');
                    } else {
                        res.send('Term has been added');
                    }
                });
            }
		)
		.get( // Get all the open and active terms
			authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                Term.find({$or: [{status: 'Open'}, {status: 'Active'}] }, function (err, terms) {
                    if (err) {
                        return res.send(err);
                    }
                    return res.json(terms);
                });
            }
		);

	apiRouter.route('/terms/findall')
		.get( // Get all the terms in the DB
			authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                Term.find({}, function (err, terms) {
                    if (err) {
                        return res.send(err);
                    }
                    return res.json(terms);
                });
            }
		);

	apiRouter.route('/terms/:id')
		.get(
        authProvider.authorizeAuthenticatedUsers,
        function (req, res) {
            Term.findById(req.params.id, function (err, term) {
                if (err)
                    return res.send(err);
                res.json(term);
            });
        })
    .put(
        authProvider.authorizeByUserType(authProvider.userType.PiCoPi),//it doesn't seem to be needed by any other users
        function (req, res) {
             Term.findById(req.params.id, function (err, term) {
                if (err) {
                    res.status(400);
                    res.send(err);
                }

                term.name = req.body.name;
                term.status = req.body.status;
			          term.start = req.body.start;
                term.end = req.body.end;
                term.active = req.body.active;
                term.open = req.body.open;

                term.save(function (err) {
                    if (err) {
                        res.status(400);
                        return res.send(err);
                    }
                    res.json({message: 'Updated!'});
                });
            });
        })
    .delete(
        authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
        function (req, res) {
            Term.remove({_id: req.params.id}, function (err, term) {
                if (err)
                    return res.send(err);
                res.json({message: 'successfully deleted!'});
            });
        });

	apiRouter.route('/terms/name/:name')
		.get(
            authProvider.authorizeAuthenticatedUsers,
            function (req, res) {
                Term.findOne({name: req.params.name}, function (err, term) {
                    if (err)
                        return res.send(err);
                    res.json(term);
                });
            })
        .put(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                 Term.findOne({name: req.params.name}, function (err, term) {
                    if (err) {
                        res.status(400);
                        res.send(err);
                    }

					term.name = req.body.name;
                    term.status = req.body.status;
					term.start = req.body.start;
                    term.end = req.body.end;
                    term.active = req.body.active;

                    term.save(function (err) {
                        if (err) {
                            res.status(400);
                            return res.send(err);
                        }
                        res.json({message: 'Updated!'});
                    });
                });
            })
        .delete(
            authProvider.authorizeByUserType(authProvider.userType.PiCoPi),
            function (req, res) {
                Term.remove({name: req.params.name}, function (err, term) {
                    if (err)
                        return res.send(err);
                    res.json({message: 'successfully deleted!'});
                });
            });

	return apiRouter;
}
