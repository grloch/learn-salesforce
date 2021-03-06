const gulp = require("gulp"),
  nunjucksRender = require("gulp-nunjucks-render"),
  Fs = require("fs"),
  sass = require("gulp-sass")(require("sass")),
  data = require("gulp-data"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify");

function buildPages() {
  return gulp
    .src(["pages/**/*.+(html|njk)"])
    .pipe(
      nunjucksRender({
        path: ["templates"],
        data: require("./params"),
      })
    )
    .pipe(gulp.dest("./docs"));
}

function buildStyle() {
  gulp
    .src("./assets/bootstrap/bootstrap-5.1.3-dist/css/bootstrap.min.css")
    .pipe(gulp.dest("./docs"));

  return gulp
    .src("./assets/scss/index.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./docs"));
}

function buildJs() {
  gulp
    .src("./assets/bootstrap/bootstrap-5.1.3-dist/js/bootstrap.min.js")
    .pipe(gulp.dest("./docs"));

  return gulp
    .src(["./assets/scripts/**/*.js"])
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("./docs"));
}

gulp.task("build-pages", buildPages);
gulp.task("build-js", buildJs);
gulp.task("build-style", buildStyle);

gulp.task("default", async () => {
  console.log("executing buildStyle");
  buildStyle();

  console.log("executing buildJs");
  buildJs();

  gulp.watch("./assets/scripts/**/*.js", gulp.series(["build-js"]));
  gulp.watch("./assets/scss/**/*.scss", gulp.series(["build-style"]));
  gulp.watch(
    [
      "./pages/**/*.njk",
      "./templates/**/*.njk",
      "./params/**/*.json",
      "./params/index.js",
    ],
    gulp.series(["build-pages"])
  );
});
