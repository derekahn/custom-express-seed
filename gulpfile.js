var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');

var paths = {
  sass: 'app/assets/sass/styles.scss',
  img: 'app/assets/images/**/*',
  js: 'app/assets/js/**/*.js',
  views: 'app/views/**/*',
  fonts: 'app/assets/fonts/**/*'
};

function onError(err) {
  notify.onError(err.message)(err);
  this.emit('end');
}

gulp.task('sass', function(){
  gulp.src(paths.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefix())
    .pipe(gulp.dest('public/css'))
    .on('error', function() {
      handleError(err);
    });
});

gulp.task('images', function () {
  gulp.src(paths.img)
    .pipe(gulp.dest('public/images/'));
});

gulp.task('js', function () {
  gulp.src(paths.js)
    .pipe(gulp.dest('public/js/'));
});

gulp.task('copy', function () {
  // Copy bower components into public/js/libs
  gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/foundation/js/foundation.js'
  ]).pipe(uglify())
    .pipe(gulp.dest('public/js/libs'));

  // Copy fonts into public/fonts
  gulp.src(paths.fonts)
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('watch', function() {
  gulp.watch('app/assets/sass/**/*.scss', ['sass']);
  gulp.watch(paths.img, ['images']);
  gulp.watch(paths.js, ['js']);

  gulp.watch([
    'public/**/*',
    paths.views
  ]).on('change', function(file) {
    livereload.changed(file.path);
  });
});

gulp.task('serve', function() {
  livereload.listen();

  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['app/assets/**', 'public/**']
  }).on('restart', function () {
      console.log('restarted! ' + (new Date()));
    });
});

gulp.task('build', ['sass', 'images', 'js', 'copy']);

gulp.task('default', ['build', 'serve', 'watch']);

