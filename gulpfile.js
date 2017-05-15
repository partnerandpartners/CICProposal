const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const path = require('path')

gulp.task('sass', function () {
  return gulp.src('./sass/style.scss')
    .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer('last 10 version'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'))
})

gulp.task('copyJS', function () {
  return gulp.src([
    './node_modules/jquery/dist/jquery.js',
    './node_modules/handlebars/dist/handlebars.min.js',
    './node_modules/lazysizes/lazysizes.min.js',
    // './node_modules/stickyfill/index.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
    // './node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    './node_modules/lunr/lunr.js',
    //'./node_modules/jquery.turbolinks/vendor/assets/javascripts/jquery.turbolinks.min.js',
    //'./node_modules/turbolinks/dist/turbolinks.js',
    //'./js/autocomplete-setup.js',
    './js/site.js',
    './js/hca.js'
  ])
    .pipe(concat('hca.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
})

gulp.task('watch', function () {
  gulp.watch('sass/**/*.scss', ['sass'])
  //gulp.watch('js/**/*.js', ['copyJS'])
})

gulp.task('build', [ 'copyJS', 'sass' ])

gulp.task('default', ['copyJS', 'sass', 'watch'])
