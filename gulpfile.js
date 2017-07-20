const gulp = require('gulp')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const plumber = require('gulp-plumber')
const unusedImages = require('gulp-unused-images')
const autoprefixer = require('autoprefixer')
const server = require('gulp-server-livereload')
const postcss = require('gulp-postcss')
const image = require('gulp-image')
// const purify = require('gulp-purifycss')
const cssnano = require('cssnano')
const path = require('path')
const destination = path.join(__dirname, 'docs')

gulp.task('pug', function buildHTML () {
  return gulp.src('./*.pug')
    .pipe(pug({}))
    .pipe(gulp.dest(destination))
})

gulp.task('copy-cname', function () {
  return gulp.src('./CNAME')
    .pipe(gulp.dest(destination))
})

gulp.task('sass', ['pug'], function () {
  var plugins = [
    autoprefixer({browsers: ['last 10 versions']}),
    cssnano()
  ]

  return gulp.src('./sass/style.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    // .pipe(autoprefixer('last 10 version'))
    // .pipe(purify(['./dist/**/*.js', './dist/**/*.html']))
    .pipe(postcss(plugins))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(destination))
})

gulp.task('js', function () {
  return gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/lazysizes/lazysizes.min.js',
    './node_modules/slick-carousel/slick/slick.min.js',
    './node_modules/howler/dist/howler.min.js',
    './js/jquery.formchimp.min.js',
    './js/script.js'
  ])
    .pipe(concat('cic.min.js'))
    // .pipe(uglify()) Kept throwing errors
    .pipe(gulp.dest(destination))
})

gulp.task('copy-slick-assets', function () {
  gulp.src([
    './node_modules/slick-carousel/slick/fonts/**/*'
  ]).pipe(gulp.dest(path.join(destination, 'fonts')))

  gulp.src([
    './node_modules/slick-carousel/slick/ajax-loader.gif'
  ]).pipe(gulp.dest(destination))
})

gulp.task('dev-images', function () {
  gulp.src('./img/**/*')
    .pipe(gulp.dest(path.join(destination, 'img')))
})

gulp.task('audio', function () {
  gulp.src('./audio/**/*')
    .pipe(gulp.dest(path.join(destination, 'audio')))
})

gulp.task('check-unused-images', function () {
  return gulp.src(['./img/**/*', './docs/**/*.css', './docs/*.html'])
    .pipe(plumber())
    .pipe(unusedImages())
    .pipe(plumber.stop())
})

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
    .pipe(gulp.dest(path.join(destination, 'img')))
})

gulp.task('watch', function () {
  gulp.watch('./**/*.pug', ['pug'])
  gulp.watch('./templates/*.pug', ['pug'])
  gulp.watch('sass/**/*.scss', ['sass'])
  gulp.watch('./img/**/*', ['dev-images'])
  gulp.watch('./js/**/*.js', ['js'])
})

gulp.task('webserver', function () {
  gulp.src(destination)
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

gulp.task('build', ['copy-cname', 'audio', 'pug', 'copy-slick-assets', 'sass', 'js', 'production-images'])

gulp.task('develop', ['copy-cname', 'audio', 'pug', 'copy-slick-assets', 'sass', 'js', 'dev-images', 'watch', 'webserver'])

gulp.task('default', ['build'])
