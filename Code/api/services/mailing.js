var User = require('../models/users');
var Support = require('../models/support');
var emailService = require("./EmailService");

var headers = {
    accountPinRecovery: "0xAccountPinRecovery"
};
var pinRecoveryMailExpiry = 1000 * 3600 * 1;

exports.sendPinRecoveryCode = function (user_token, baseWebUrl, SCCallback, ERCallback) {
    if (!SCCallback)
        SCCallback = function () { };
    if (!ERCallback)
        ERCallback = function () { };

    User.findById(user_token.valueOf(), function (err, user) {
        if (err) {
            throw err;
        }

        if (user) {
           var object = {};
            object.user_id = user_token;
            object.header = headers.accountPinRecovery;
            object.verifyCode = _CREATE__VERIFICATION___CODE().toString();
            object.date = Date.now();

            var content = "You received this email in order to a password reset request. Please click on the link below," +
                " or copy and paste it into your web browser to proceed:" + "<br/>\n" + "<br/>\n "
                + baseWebUrl + "/password_request?auth_id=" + object.user_id + "&code=" + object.verifyCode;
            var subject = "Account Password Recovery";

            emailService.sendEmailWithHeaderAndSignature(user, content, subject, ERCallback, function () {
                Support.update({ user_id: user_token }, object, { upsert: true }, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            });
        } else {
            ERCallback();
        }
    })
};

exports.verifyPinRecoveryCode = function (user_token, verificationCode, SCCallback, ERCallback) {
    if (!SCCallback) {
        SCCallback = function () { };
    }
    if (!ERCallback) {
        ERCallback = function () { };
    }

    var query = {
        user_id: user_token,
        header: headers.accountPinRecovery,
        verifyCode: verificationCode
    };
    Support.findOne(query, function (err, support_request) {
        if (err) {
            throw err;
        }

        if (support_request) {
            if ((support_request.date + pinRecoveryMailExpiry) > Date.now())
                SCCallback();
            else {
                ERCallback({ e: 'expired_code' });
            }
        } else {
            ERCallback();
        }
    })
};

function _CREATE__VERIFICATION___CODE() {
    var code = Math.floor(Math.random() * 1000000);

    if (code.toString().length < 6)
        code = _CREATE__VERIFICATION___CODE();

    return code;
}