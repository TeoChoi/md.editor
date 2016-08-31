var gulp = require("gulp");
var webpack = require("webpack-stream");
var connect = require("gulp-connect");
var webpackConfig = require("./webpack.config.js");

gulp.task("server", function () {
    connect.server({
        livereload: true
    });
});

gulp.task("webpack", function () {
    gulp.src("./src/MdEditor.js", {base: "./"})
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest("dist/"));

    gulp.src(['./build/*.js']).pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['./src/*.js'], ['webpack'])
});

gulp.task('default', ['server', 'watch'])