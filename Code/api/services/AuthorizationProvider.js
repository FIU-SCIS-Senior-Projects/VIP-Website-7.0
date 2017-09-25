var Project = require('../models/projects');

var unauthorized = function (res) {
    res.status(403).send({
        message: "You are not authorized to perform this operation. If you believe this to be an error, please contact the Pi."
    });
};

var validateAuthenticated = function (req, res, successCallback) {
    if (req.user) {
        if (req.user.piApproval || req.user.userType === userType.Student) {//students don't need to be approved
            successCallback();
        } else {
            unauthorized(res);
        }
    } else {
        res.status(401).send({
            message: "You are currently not logged in to the system. Please login and try again."
        });
    }
};

var matchesUserType = function (req, userType) {
    if (req.user.userType === userType || (Array.isArray(userType) && userType.indexOf(req.user.userType) !== -1)) {
        return true;
    } else {
        return false;
    }
};

var ownsProject = function (req, projectId, successCallback, failureCallback) {
    Project.findOne({_id: projectId}, 'owner_email', function (error, project) {
        if (error) {
            console.log(error);
            return failureCallback();
        }
        if (req.user.email === project.owner_email) {
            return successCallback();
        } else {
            return failureCallback();
        }
    });
};

var getValueFromReqByPath = function (req, path) {
    var value = req;
    path.split('.').forEach(function (part) {
        value = value[part];
    });
    return value;
};

var userType = {
    PiCoPi: "Pi/CoPi",
    StaffFaculty: "Staff/Faculty",
    Student: "Student"
};

var attemptAlternativeAuthorization = function (orAuthorize, req, res, next) {
    if (orAuthorize) {
        orAuthorize(req, res, next);
    } else {
        unauthorized(res);
    }
};

/*
 Note the pattern below is as follows. Each of the non trivial(trivial functions are authorizeAll and authorizeAuthenticatedUsers)
 functions below are factory functions which create an express middleware/functions. The factory functions always take an
 optional last parameter named orAuthorize. orAuthorize has to also be an express middleware which allows for chaining of
 the methods below. For example:
 authProvider.authorizeByUserType(authProvider.userType.PiCoPi,
 authProvider.authorizeProjectOwner('params.id',
 authProvider.authorizeByUserEmail('params.members')))
 The above means, authorize a PiCopi user, or the faculty that owns the project(whose id is at req.params.id),
 or authorize the user whose email is specified in req.params.members.
 */
module.exports = {
    userType: userType,
    authorizeAll: function (req, res, next) {//no validation here, everyone is allowed access, used as a marker to make obvious who has access
        return next();
    },
    authorizeAuthenticatedUsers: function (req, res, next) {//allow only authenticated/logged in users
        validateAuthenticated(req, res, next);
    },
    authorizeByUserType: function (userType, orAuthorize) {
        //note userType here can either be a string representing a single userType or an array of userTypes
        return function (req, res, next) {
            validateAuthenticated(req, res, function () {
                if (matchesUserType(req, userType)) {
                    next();
                } else {
                    attemptAlternativeAuthorization(orAuthorize, req, res, next);
                }
            });
        };
    },
    authorizeProjectOwner: function (projectIdPath, orAuthorize) {//path to the project id field in the req variable, example, params.id for req.params.id
        return function (req, res, next) {
            module.exports.authorizeByUserType(userType.StaffFaculty, orAuthorize)(req, res, function () {
                var projectId = getValueFromReqByPath(req, projectIdPath);
                ownsProject(req, projectId, function () {
                    return next();
                }, function () {
                    attemptAlternativeAuthorization(orAuthorize, req, res, next);
                });
            });
        };
    },
    authorizeByUserEmail: function (userEmailPath, orAuthorize) {
        return function (req, res, next) {
            validateAuthenticated(req, res, function () {
                var studentEmail = getValueFromReqByPath(req, userEmailPath);
                if (req.user.email === studentEmail) {
                    return next();
                } else {
                    attemptAlternativeAuthorization(orAuthorize, req, res, next);
                }
            });
        }
    },
    authorizeByUserId: function (userIdPath, orAuthorize) {
        return function (req, res, next) {
            validateAuthenticated(req, res, function () {
                var userId = getValueFromReqByPath(req, userIdPath);
                if (req.user._id.toString() === userId) {
                    return next();
                } else {
                    attemptAlternativeAuthorization(orAuthorize, req, res, next);
                }
            });
        }
    }
};