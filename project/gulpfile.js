'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync('package.json')),
    sass = require('gulp-sass'),
    // sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    data = require('gulp-data');


var prName = pkg.name,
    inputCss = 'src/sass/*.sass',
    outputCss = 'public/css/';


var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var autoprefixerOptions = {
    browsers: ['last 30 versions']
};

gulp.task('sass', function () {
    return gulp
        .src(inputCss)
        // .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        // .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize + ' b');
            console.log(details.name + ': ' + details.stats.minifiedSize + ' b');
        }))
        .pipe(cssmin())
        .pipe(rename(prName + '.min.css'))
        .pipe(gulp.dest(outputCss))
        .resume();
});

gulp.task('js', function () {
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/bootstrap/js/collapse.js',
        // 'bower_components/bootstrap/js/modal.js',
        'bower_components/typed.js/dist/typed.min.js',
        'dev_source/js/jquery.matchHeight.js',
        'dev_source/js/index.js'
    ])
        .pipe(concat(pkg.name + '.lib.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(outputJsLibraries));
});

gulp.task('watch', function () {

    gulp.watch(inputCss, ['sass'])
        .on('change', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });

    gulp.watch(inputJsLibraries, ['js']);
});


gulp.task('default', ['sass', 'watch', 'js']);
