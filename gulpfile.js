'use strict';

/* --------------------------------------------------------------- */
/*  Plugins                                                        */
/* --------------------------------------------------------------- */
var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins         = gulpLoadPlugins(),
    del             = require('del'),
    cmq             = require('gulp-group-css-media-queries'),
    minifyCSS       = require('gulp-clean-css'),
    runSequence     = require('run-sequence');

/* --------------------------------------------------------------- */
/*  Paths                                                          */
/* --------------------------------------------------------------- */
var basePaths = {
    src: 'archives/source/',
    dest: 'archives/assets/'
};

var paths = {
    css: {
        src: basePaths.src + 'scss/',
        dest: basePaths.dest + 'css/'
    },
    js: {
        src: basePaths.src + 'js/',
        dest: basePaths.dest + 'js/'
    },
    img: {
        src: basePaths.src + 'img/',
        dest: basePaths.dest + 'img/'
    },
    font: {
        src: basePaths.src + 'fonts/',
        dest: basePaths.dest + 'fonts/'
    }
};

/* --------------------------------------------------------------- */
/*  Tasks                                                          */
/* --------------------------------------------------------------- */
gulp.task('clean', function(){
    return del(basePaths.dest);
});

gulp.task('copy', function() {
    gulp.src(paths.font.src + '**')
        .pipe(gulp.dest(paths.font.dest));
    gulp.src(paths.js.src + 'data.js')
        .pipe(gulp.dest(paths.js.dest));
});

gulp.task('img', function() {
    gulp.src(paths.img.src + '**')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(paths.img.dest));
});

gulp.task('csslint', function() {
    console.log('============================================================================== CSS');
    gulp.src(paths.css.src + '*.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.stylelint({
        reporters: [{
            formatter: 'string',
            console: true
        }]
    }));
});

gulp.task('css', ['csslint'], function() {
    return gulp
        .src(paths.css.src + '*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.plumber())
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(cmq())
        .pipe(plugins.sourcemaps.write('../maps'))
        .pipe(plugins.rename('style.css'))
        .pipe(gulp.dest(paths.css.dest));
});

gulp.task('jshint', function() {
    console.log('============================================================================== JS');
    gulp.src([
            paths.js.src + '**',
            '!' + paths.js.src + 'vendor/**'
        ])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('js', ['jshint'], function() {
    return gulp
        .src([
            paths.js.src + 'vendor/jquery.js',
            paths.js.src + 'vendor/jquery-ui.js',
            paths.js.src + 'app.js'
        ])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('script.js'))
        .pipe(plugins.sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.js.dest));
});

gulp.task('watch', function() {
    gulp.watch(paths.js.src + '**', ['js']);
    gulp.watch(paths.css.src + '**', ['css']);
    gulp.watch(paths.img.src + '**', ['img']);
    gulp.watch([
            paths.js.src + 'data.js',
            paths.font.src + '**'
        ], ['copy']);
});

gulp.task('build', function() {
    runSequence('clean', ['img', 'copy', 'css', 'js']);
});

gulp.task('default', [
    'build',
    'watch'
]);
