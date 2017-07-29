var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require("gulp-babel");
var mustache = require("gulp-mustache");


var config = {
    bootstrapDir: './bower_components/bootstrap-sass',
    cookieJsDir: './bower_components/cookie-js',
    publicDir: './public',
};

/* Compile all .scss files into css, move them to public stylesheets directory */
gulp.task('css', function () {
    return gulp.src('./sass/*.scss')
        .pipe(sass({
            includePaths: [config.bootstrapDir + '/assets/stylesheets'],
        }))
        .pipe(gulp.dest(config.publicDir + '/stylesheets'));
});

gulp.task('scripts', function () {
    return gulp.src(config.bootstrapDir + '/assets/javascripts/bootstrap.min.js')
        .pipe(gulp.dest(config.publicDir + '/javascripts/libs'));
});

/* Bootstrap fonts */
gulp.task('fonts', function () {
    return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
        .pipe(gulp.dest(config.publicDir + '/fonts'));
});

/* Watch .scss files, recompile and move on change (Run 'gulp watch') */
gulp.task('watch', function () {
    gulp.watch('./sass/*.scss', ['css'])
});

gulp.task('es6-regular', function () {
    return gulp.src(config.publicDir + '/es6/**/*.!js').pipe(gulp.dest(config.publicDir + '/javascripts'));
});

gulp.task('es6', function () {
    return gulp.src(config.publicDir + '/es6/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest(config.publicDir + '/javascripts'));
});

gulp.task('mustache', function () {
    return gulp.src("./templates/*.mustache")
        .pipe(mustache({
            msg: "Hello Gulp!"
        }))
        .pipe(gulp.dest("./dist"));
});


gulp.task('default', ['css', 'scripts', 'fonts', 'es6', 'es6-regular', 'mustache']);
