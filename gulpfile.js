const gulp = require('gulp')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const plumber = require('gulp-plumber')
const image = require('gulp-image')
const unusedImages = require('gulp-unused-images')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')

const server = require('gulp-server-livereload')

const path = require('path')

var imageSource = './img',
    imageDestination = './dist/img';

gulp.task('pug', function buildHTML() {
  return gulp.src('./*.pug')
  .pipe(pug({
    // Your options in here.
  }))
  .pipe(gulp.dest('./dist'))
})

gulp.task('sass', function () {
  return gulp.src('./sass/style.scss')
    .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer('last 10 version'))
    .pipe(sourcemaps.write())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('js', function () {
  return gulp.src([
    './node_modules/jquery/dist/jquery.js',
    './node_modules/handlebars/dist/handlebars.min.js',
    './node_modules/lazysizes/lazysizes.min.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
    './node_modules/lunr/lunr.js',
    './js/site.js',
    './js/cic.js'
  ])
    .pipe(concat('cic.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
})

gulp.task('dev-images', function () {
  gulp.src('./img/**/*')
    .pipe(gulp.dest('./dist/img'));
})

gulp.task('check-unused-images', function () {
    return gulp.src(['./img/**/*', './dist/**/*.css', './dist/*.html'])
        .pipe(plumber())
        .pipe(unusedImages())
        .pipe(plumber.stop());
});

gulp.task('production-images', function () {
  gulp.src('./img/**/*')
    .pipe(image({
      pngquant: true,
      optipng: true,
      zopflipng: false,
      jpegRecompress: true,
      jpegoptim: true,
      mozjpeg: true,
      guetzli: false,
      gifsicle: true,
      svgo: false,
      concurrent: 100
    }))
    .pipe(gulp.dest('./dist/img'));
})

gulp.task('watch', function () {
  gulp.watch('./*.pug', ['pug'])
  gulp.watch('sass/**/*.scss', ['sass'])
  gulp.watch('./img/**/*', ['dev-images'])
  //gulp.watch('js/**/*.js', ['copyJS'])
})

gulp.task('webserver', function () {
  gulp.src('./dist')
    .pipe(server({
      host: '127.0.0.1',
      livereload: {
        enable: true
      },
      directoryListing: false,
      open: false,
      fallback: '404.html'
    }))
})

gulp.task('build', ['pug', 'sass', 'js', 'production-images'])

gulp.task('develop', ['pug', 'sass', 'js', 'dev-images', 'watch', 'webserver'])

gulp.task('default', ['js', 'sass', 'watch'])
