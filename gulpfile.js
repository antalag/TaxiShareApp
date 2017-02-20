var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var bower = require('bower');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var sh = require('shelljs');
var pkg = require('./package.json');

var assets = 'www/assets';

var paths = {
    sass: ['./scss/**/*.scss']
};

var source = {
    js: [
        'www/js/app.js',
        'www/js/**/*.js'
//    'www/js/controllers/*.js',
//    'www/js/services/*.js'
    ],

    styl: [
        'www/css/*.css'
    ],
    sass: [
        'www/css/*.scss'
    ]
}

var bower = {
    js: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/ionic/release/js/ionic.bundle.js',

        'bower_components/moment/min/moment-with-locales.min.js',
        'bower_components/angular-resource/angular-resource.min.js',
        'bower_components/angular-translate/angular-translate.min.js',
        'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'bower_components/socket.io-client/dist/socket.io.js',
//        'bower_components/angular-socket-io/socket.js',
        'bower_components/sails.io.js/dist/sails.io.js',
//        'bower_components/sails.io-client/dist/socket.io.js',
        'bower_components/angular-sails/dist/angular-sails.js',
        'bower_components/ionic-material/dist/ionic.material.min.js',
        'www/lib/ionic.cloud.min.js',
//    'bower_components/angular-directive.g-signin/google-plus-signin.js',

        'www/js/ng-cordova.min.js',

        'bower_components/ion-gallery/dist/ion-gallery.js',
    ],

    css: [
        'bower_components/ionic/release/css/ionic.css',
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/robotodraft/robotodraft.css',
        'bower_components/ionic-material/dist/ionic.material.min.css'
    ],
    robodraft:[
        'bower_components/robotodraft/fonts/**/*'
    ],

    fonts: [
        'bower_components/bootstrap/dist/fonts/*',
        'bower_components/ionic/release/fonts/*'
    ]
};

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link    <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

// -- TASKS --------------------------------------------------------------------
gulp.task('js', function () {
    gulp.src(source.js)
            .pipe(concat(pkg.name + '.js'))
//    .pipe(uglify({mangle: false}))
            // .pipe(header(banner, {pkg: pkg}))
            .pipe(gulp.dest(assets + '/js'));
});

gulp.task('styl', function () {
    var css = gulp.src(source.styl)
            .pipe(concat('css-files.css'))
            .pipe(stylus({compress: true, errors: true}));
    var scss = gulp.src(source.sass)
            .pipe(sass({
                errLogToConsole: true
            }))
            .pipe(concat('scss-files.scss'));
    var mergedStream = merge(css, scss)
        .pipe(concat(pkg.name+'.css'))
//        .pipe(minify())
            .pipe(gulp.dest(assets + '/css'));

});

gulp.task('components', function () {
    gulp.src(bower.js)
            .pipe(concat(pkg.name + '.components.js'))
//    .pipe(uglify({mangle: false}))
            // .pipe(header(banner, {pkg: pkg}))
            .pipe(gulp.dest(assets + '/js'));
    gulp.src(bower.css)
            .pipe(concat(pkg.name + '.components.css'))
            // .pipe(header(banner, {pkg: pkg}))
            .pipe(gulp.dest(assets + '/css'));
    gulp.src(bower.robodraft)
//            .pipe(concat(pkg.name + '.components.css'))
            // .pipe(header(banner, {pkg: pkg}))
            .pipe(gulp.dest(assets + '/css/fonts'));
    gulp.src(bower.fonts)
            .pipe(gulp.dest(assets + '/fonts'));
});

gulp.task('init', function () {
    gulp.run(['js', 'components', 'styl']);
});

gulp.task('default', function () {
    gulp.watch(source.js, ['js']);
    gulp.watch(source.styl, ['styl']);
    gulp.watch(source.sass, ['styl']);

});

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
            .pipe(sass({
                errLogToConsole: true
            }))
            .pipe(gulp.dest('./www/css/'))
            .pipe(minifyCss({
                keepSpecialComments: 0
            }))
            .pipe(rename({extname: '.min.css'}))
            .pipe(gulp.dest('./www/css/'))
            .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
            .on('log', function (data) {
                gutil.log('bower', gutil.colors.cyan(data.id), data.message);
            });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
                '  ' + gutil.colors.red('Git is not installed.'),
                '\n  Git, the version control system, is required to download Ionic.',
                '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
                '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
                );
        process.exit(1);
    }
    done();
});
