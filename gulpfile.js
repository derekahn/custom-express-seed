var gulp = require('gulp'),
  compass = require('gulp-compass'),
  plumber = require('gulp-plumber'),
  prefix = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  refresh = require('gulp-livereload'),
  nodemon = require('gulp-nodemon'),
  notify = require('node-notifier'),
  lr = require('tiny-lr'),
  lrserver = lr();

function handleError(err) {
  notify(err.toString());
  this.emit('end');
}

gulp.task('scss', function() {
  gulp.src('./app/assets/scss/app.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: './config.rb',
      css: './public/css',
      sass: './app/assets/scss'
    }))
    .pipe(prefix())
    .pipe(gulp.dest('./public/css'))
    .on('error', function() {
      handleError(err);
    });
});

gulp.task('img', function() {
  gulp.src('./app/assets/img/**/*')
    .pipe(gulp.dest('./public/img/'));
});

gulp.task('js', function() {
  gulp.src('./app/assets/js/**/*.js')
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('views', function() {
  gulp.src('./app/views/**/*')
    .pipe(gulp.dest('./public/'));
});

gulp.task('copy', function() {
  // Copy bower components into public/js/libs
  gulp.src([
    './bower_components/jquery/dist/jquery.js',
    './bower_components/foundation/js/foundation.js',
    './bower_components/modernizr/modernizr.js'
  ]).pipe(uglify())
    .pipe(gulp.dest('./public/js/libs'));
});

gulp.task('watch', function() {

  gulp.watch('./app/assets/scss/**/*.scss', ['scss']);
  gulp.watch('./app/assets/img/**/*', ['img']);
  gulp.watch('./app/assets/js/**/*.js', ['js']);
  // gulp.watch('./app/views/**/*', ['views']);

  //refresh.listen();
  gulp.watch('./public/**/*').on('change', refresh.changed);
});

gulp.task('serve', function() {
  nodemon({
    script: 'server.js',
    ext: 'js'
  }).on('restart', function() {
    console.log('restarted! ' + (new Date()));
  });

  // lrserver.listen();
});

gulp.task('build', ['scss', 'img', 'js']);

gulp.task('default', ['build', 'serve', 'watch']);