var User = require('../models/users');
var Support = require('../models/support');
var mailingService = require('../services/mailing');
var bcrypt = require('bcrypt-nodejs');
var authProvider = require('../services/AuthorizationProvider');

module.exports = function (app, express) {

    var supportRouter = express.Router();
    var baseWebUrl = app.get("baseWebUrl");

    supportRouter.route('/recover/validate_email')
        .post(
            authProvider.authorizeAll,
            function (req, res) {
                User.findOne({email: req.body.email}, '_id', function (err, record) {
                    if (err) {
                        throw err;
                    }

                    if (record && record._id) {
                        mailingService.sendPinRecoveryCode(record._id, baseWebUrl, function () { }, function () { });
                    }
                    var object = { validated: false };
                    if (record && record._id) {
                        object.validated = true;
                        object._id = record._id
                    }
                    res.json(object);
                });
            });

    supportRouter.route('/recover/verify_code')
        .post(
            authProvider.authorizeAll,
            function (req, res) {
                var d = req.body;
                mailingService.verifyPinRecoveryCode(d.user_id, d.code, function () {

                    res.json({
                        validated: true
                    });

                }, function (err) {
                    res.json({
                        validated: false,
                        error: err ? err.e : null
                    });
                });

            });

    supportRouter.route('/recover/publish_password')
        .post(
            authProvider.authorizeAll,
            function (req, res) {
                var d = req.body;
                var hash = null;
                bcrypt.hash(d.password, null, null, function (err, h) {
                    if (err) {
                        res.json({validated: false});
                    }
                    hash = h;
                    User.update({_id: require('mongoose').Types.ObjectId(d.user_id)}, {
                        password: hash,
                        passwordConf: hash
                    }, function (err, object) {
                        if (err) {
                            res.json({validated: false});
                        }
                        res.json({validated: true});

                        Support.remove({user_id: d.user_id}, function (err) {
                            if (err) {
                                res.json({validated: false});
                            }
                        });
                    });
                });
            });

    supportRouter.route('/recover/reset_pin')
        .post(
            authProvider.authorizeAll,
            function (req, res) {
                if (req.body.client && req.body.password) {
                    Api.Private.UserAccounts.UpdateSettings(
                        req.body.client, {password: req.body.password}, function () {
                            res.json({
                                validated: true
                            })
                        }, next);
                } else {
                    next()
                }
            });

    return supportRouter;
};