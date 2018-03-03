var gulp          = require('gulp'),
    gutil         = require('gulp-util' ),
    sass          = require('gulp-sass'),
    browsersync   = require('browser-sync'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    cleancss      = require('gulp-clean-css'),
    rename        = require('gulp-rename'),
    autoprefixer  = require('gulp-autoprefixer'),
    notify        = require("gulp-notify"),
    del           = require("del"),
    htmlReplace   = require("gulp-html-replace"),
    imagemin   = require("gulp-imagemin"),
    cache   = require("gulp-cache");

gulp.task('browser-sync', function() {
    browsersync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        //open: false
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    })
});

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
    //.pipe(rename({ suffix: '.min', prefix : '' }))
    .pipe(autoprefixer(['last 15 versions']))
    //.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest('app/css'))
    .pipe(browsersync.reload( {stream: true} ))
});

gulp.task('js', function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        //'app/libs/fontawesome/svg-with-js/js/fontawesome-all.min.js', //Fontawesome JS
        'app/js/common.js' // Always at the end
        ])
    .pipe(concat('scripts.min.js'))
    // .pipe(uglify()) // Mifify js (opt.)
    .pipe(gulp.dest('app/js'))
    .pipe(browsersync.reload({ stream: true }))
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
    gulp.watch('app/*.html', browsersync.reload)
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('build',['clean', 'img'], function() {
    var replace = gulp.src('app/*.html')
        .pipe(htmlReplace({
            'css': 'css/main.min.css'
        }))
        .pipe(gulp.dest('dist'));

    var buildCss = gulp.src('app/css/**/*.css')
        .pipe(rename({ suffix: '.min', prefix : '' }))
        .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/scripts.min.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

});

gulp.task('default', ['watch']);
