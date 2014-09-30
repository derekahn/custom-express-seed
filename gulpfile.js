var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var refresh = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');

function onError(err) {
  notify.onError(err.message)(err);
  this.emit('end');
}

gulp.task('sass', function(){
  gulp.src('./app/assets/sass/styles.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefix())
    .pipe(gulp.dest('./public/css'))
    .on('error', function() {
      handleError(err);
    });
});

gulp.task('images', function () {
  gulp.src('./app/assets/images/**/*')
    .pipe(gulp.dest('./public/images/'));
});

gulp.task('js', function () {
  gulp.src('./app/assets/js/**/*.js')
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('data', function() {
  gulp.src('./app/assets/data/**/*.json')
    .pipe(gulp.dest('./public/data'));
});

gulp.task('copy', function () {
  // Copy bower components into public/js/libs
  gulp.src([
    './bower_components/jquery/dist/jquery.js',
    './bower_components/foundation/js/foundation.js',
    './bower_components/Calendario/jquery.calendario.js',
    './bower_components/Calendario/modernizr.custom.63321.js'
  ]).pipe(uglify())
    .pipe(gulp.dest('./public/js/libs'));

  // Copy fonts into public/fonts
  gulp.src('./app/assets/fonts/**/*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('watch', function() {
  gulp.watch('./app/assets/sass/**/*.scss', ['sass']);
  gulp.watch('./app/assets/images/**/*', ['images']);
  gulp.watch('./app/assets/js/**/*.js', ['js']);
  gulp.watch('./public/**/*').on('change', function(file) {
    refresh.changed(file.path);
  });
});

gulp.task('serve', function() {
  nodemon({
    script: 'server.js',
    ext: 'server.js'
  }).on('restart', function () {
      console.log('restarted! ' + (new Date()));
    });

  // lrserver.listen();
});

gulp.task('build', ['sass', 'images', 'js', 'data', 'copy']);

gulp.task('default', ['build', 'serve', 'watch']);

