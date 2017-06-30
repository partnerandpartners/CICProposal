const gulp = require('gulp')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const image = require('gulp-image')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')

const server = require('gulp-server-livereload')

const path = require('path')

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

gulp.task('image', function () {
  gulp.src('./img/*')
    .pipe(image({
      pngquant: false,
      optipng: false,
      zopflipng: false,
      jpegRecompress: false,
      jpegoptim: false,
      mozjpeg: false,
      guetzli: false,
      gifsicle: false,
      svgo: false,
      concurrent: 100
    }))
    .pipe(gulp.dest('./dist/img'));
})

gulp.task('watch', function () {
  gulp.watch('./*.pug', ['pug'])
  gulp.watch('sass/**/*.scss', ['sass'])
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

gulp.task('build', ['pug', 'sass', 'js', 'image'])

gulp.task('develop', ['build', 'watch', 'webserver'])

gulp.task('default', ['js', 'sass', 'watch'])
