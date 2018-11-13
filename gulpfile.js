"use strict";

const gulp = require("gulp");
const del = require("del");
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");
const server = require("browser-sync").create();

const csso = require("gulp-csso");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

const htmlmin = require("gulp-htmlmin");
const htmlreplace = require("gulp-html-replace");

const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");

const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task("css", () => {
  return gulp.src("source/sass/main.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
});

gulp.task("images", () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img/"))
});

gulp.task("webp", () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img/"))
});

gulp.task("clean", () => {
  return del("build/**", {force: true});
});

gulp.task("html:build", () => {
  return gulp.src("source/*.html")
    .pipe(htmlreplace({
      "css": "./css/style.min.css",
      "js": "./js/main.min.js"
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
});

gulp.task("html", () => {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"))
});

gulp.task("scripts", () => {
  return gulp.src("source/js/*.js")
    .pipe(plumber())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('build/js/'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('build/js/'))
});

gulp.task("copy", () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2,ttf,eot}",
    "source/img/**/*.{jpg,png,svg}",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("refresh", (done) => {
  server.reload();
  done();
});

gulp.task("server", () => {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/fonts/**/*.{woff,woff2}", gulp.series("copy", "refresh"));
  gulp.watch("source/img/**/*.{jpg,png,svg}", gulp.series("copy", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("scripts", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("start", gulp.series("css", "html", "copy", "scripts", "server"));

gulp.task("build",
  gulp.series("clean", gulp.parallel("copy", "webp", "html:build", "css", "scripts")));
