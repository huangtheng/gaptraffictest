var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('js', function() {
  gulp.src(['./scripts/lib/css-beziers.js', './scripts/utils/menu_default.js', './scripts/utils/Utils.js', './scripts/services/cordovaService.js', './scripts/services/ConnectService.js', './scripts/services/DatabaseService.js', './scripts/models/menuQuestionModel.js', './scripts/models/QuestionModel.js', './scripts/helper.js', './scripts/controllers/app.js','./scripts/controllers/homeController.js', './scripts/controllers/searchController.js', './scripts/controllers/themeController.js', './scripts/controllers/categoriesController.js', './scripts/controllers/questionController.js','./scripts/controllers/testController.js', './scripts/controllers/questionSearchController.js', './scripts/controllers/settingController.js'])
    .pipe(concat('script.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('./www/js'))
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
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
