var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean_css = require('gulp-clean-css');
var clean = require('gulp-clean');
var ng_annotate = require ('gulp-ng-annotate');

module.exports = function(webapp) {
    var distribFolder = webapp + 'distrib';

    var jsFiles = [
        webapp + 'lib/sweetalert/dist/sweetalert.min.js',
        webapp + "lib/angular/angular.min.js",
        webapp + "lib/angular-sanitize/angular-sanitize.min.js",
        webapp + "lib/angular-ui-router/release/angular-ui-router.min.js",
        webapp + "lib/jquery/dist/jquery.min.js",
        webapp + "lib/bootstrap/dist/js/bootstrap.min.js",
        webapp + "lib/angular-bootstrap/ui-bootstrap-tpls.min.js",
        //User Story #1142
        webapp + "lib/trix-textarea-toolbar/trix.js",
        webapp + "lib/trix-textarea-toolbar/angular-trix.min.js",
        webapp + 'lib/textAngular/dist/textAngular-rangy.min.js',
        webapp + 'lib/textAngular/dist/textAngular-sanitize.min.js',
        webapp + 'lib/textAngular/dist/textAngular.min.js',
        webapp + 'lib/admin-report/alasql.js',
        webapp + 'lib/admin-report/xlsx.core.min.js',
        //modules: These files need to be loaded first in order for the controller and directives and factories to be able to use them
        webapp + "features/to-do/ToDoModule.js",
        webapp + "features/vip-projects/vip-projects.module.js",
        webapp + "features/profile-page/user-profile.module.js",
        webapp + "features/reviewRegistration/reviewRegModule.js",
        webapp + "features/reviewStudentApplications/reviewStudentAppModule.js",
        webapp + "features/reviewProjectProposals/reviewProjectProposalsModule.js",
        webapp + "features/reviewProfile/reviewProfileModule.js",
        webapp + "features/admin-panel/adminModule.js",
        //controllers
        webapp + "features/vip-projects/vip-projects.controller.js",
        webapp + "features/vip-projects/vip-projects-detailed.controller.js",
        webapp + "features/project-proposals/ProjectProposalController.js",
        webapp + "features/profile-page/user-profile.controller.js",
        webapp + "features/reviewRegistration/reviewRegController.js",
        webapp + "features/apply-to-project/projectApplicationController.js",
        webapp + "features/registration/userRegistrationController.js",
        webapp + "features/to-do/ToDoController.js",
        webapp + "features/drive/folder.js",
        webapp + "features/forgot-password/forgotPasswordController.js",
        webapp + "features/forgot-password/forgotPasswordService.js",
        webapp + "features/reviewStudentApplications/reviewStudentAppController.js",
        webapp + "features/reviewProjectProposals/reviewProjectProposalsController.js",
        webapp + "features/reviewProfile/reviewProfileController.js",
        webapp + "features/contact/contactController.js",
        webapp + "features/admin-panel/adminController.js",
        webapp + "features/messenger/MessengerController.js",
        webapp + "features/view-profile/view-profileController.js",
        //services
        webapp + "features/project-proposals/ProjectProposalService.js",
        webapp + "features/registration/userService.js",
        webapp + "features/to-do/ToDoService.js",
        webapp + "features/profile-page/user-profile.service.js",
        webapp + "features/reviewRegistration/reviewRegService.js",
        webapp + "features/reviewStudentApplications/reviewStudentAppService.js",
        webapp + "features/reviewProjectProposals/reviewProjectProposalsService.js",
        webapp + "features/reviewProfile/reviewProfileService.js",
        webapp + "features/admin-panel/adminService.js",
        webapp + "features/messenger/MessengerService.js",
        webapp + "features/reusable-services/DateTimeService.js",
        webapp + "features/reusable-services/LocationService.js",
        webapp + "features/reusable-services/skills/SkillsService.js",
        //directives
        webapp + "features/reusable-services/skills/SkillsDirective.js",
        webapp + "features/header/headerDirective.js",
        webapp + "features/footer/footerDirective.js",
        //main Angular app files
        webapp + "app.js",
        webapp + "routes.js"
    ];

    var cssFiles = [
        webapp + "lib/sweetalert/dist/sweetalert.css",
        //load bootstrap and custom CSS
        webapp + "lib/bootstrap/dist/css/bootstrap.min.css",
        webapp + "css/style.css",
        webapp + "lib/textAngular/dist/textAngular.css",
        //User Story #1142
        webapp + "lib/trix-textarea-toolbar/trix.css",
    ];

    gulp.task('clean', function () {
        return gulp.src(distribFolder + '/**/*')
            .pipe(clean({force: true}));
    });

    gulp.task('processScripts', ['clean'], function () {
        return gulp.src(jsFiles)
            .pipe(concat('scripts.js', {newline: ';'}))
            .pipe(gulp.dest(distribFolder))
            // .pipe(rename('scripts.min.js'))
            // .pipe(ng_annotate())
            // .pipe(uglify({mangle: false}))
            // .pipe(gulp.dest(distribFolder))
    });

    gulp.task('processStylesheets', ['clean'], function () {
        return gulp.src(cssFiles)
            .pipe(concat('styles.css'))
            .pipe(gulp.dest(distribFolder))
            .pipe(clean_css())
            .pipe(rename('styles.min.css'))
            .pipe(gulp.dest(distribFolder))
    });

    gulp.task('build', ['processScripts', 'processStylesheets']);
    gulp.start('build');
};
