var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function () {
  gulp.src("api/**")
    .pipe(babel())
    .pipe(gulp.dest("dist/api"));

  gulp.src("config/**")
    .pipe(babel())
    .pipe(gulp.dest("dist/config"));
});
