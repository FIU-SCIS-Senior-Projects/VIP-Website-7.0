var Values = require('../models/values');
var authProvider = require('../services/AuthorizationProvider');

module.exports = function(app, express) {
    var apiRouter = express.Router();

    var retrieveSkills = function(res, successCallback) {
        Values.findOne({key: "skills"}, function (error, result) {
            if (error) {
                return res.status(500).send(
                    { message: 'An unexpected error prevented us from retrieving the skills from the database.'});
            }
            if (!result) {
                return successCallback([]);
            } else {
                return successCallback(result.value);
            }
        });
    };

    apiRouter.route('/skills')
        .post(//create a new value
            authProvider.authorizeAuthenticatedUsers,
            function(req, res) {
                var reqSkills = req.body.skills;
                retrieveSkills(res, function(skills) {
                    var newSkills = reqSkills.filter(function(reqSkill) {
                        var isNew = true;
                        skills.forEach(function(skill) {
                            if (skill === reqSkill) {
                                isNew = false;
                            }
                        });
                        return isNew;
                    });
                    skills = skills.concat(newSkills);
                    Values.update({ key: "skills" }, { value: skills }, { upsert: true }, function(err, raw) {
                        if (err) {
                            return res.status(500).send(
                                { message: 'An unexpected error prevented us from updating the skills in the database.'});
                        }
                        return res.send(skills);
                    });
                });
            })
        .get(
            authProvider.authorizeAll,
            function(req, res) {
                retrieveSkills(res, function (skills) {
                    res.send(skills);
                });
            }
        );

    return apiRouter;
};
