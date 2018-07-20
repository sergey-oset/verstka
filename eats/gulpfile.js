const gulp = require('gulp');
const minifycss = require('gulp-csso');
const postcss = require('gulp-postcss');

// плагины для ПостЦСС
const autoprefixer = require('autoprefixer');
const cssnext = require('postcss-cssnext');

const imagemin = require('gulp-imagemin');

const minifyhtml = require('gulp-htmlmin');
const watch = require('gulp-watch');

const stylelint = require('gulp-stylelint');

gulp.task('styles', function() {
  return gulp
    .src('src/styles/*.css') // через .src() передаём путь до исходника
    .pipe(postcss([cssnext()])) //  через .pipe() вызываем плагин как функцию
    .pipe(minifycss()) // и ещё раз
    .pipe(gulp.dest('build/styles')); // в финальном пайпе через gulp.dest() указываем куда сложить результат
});

gulp.task('images', function() {
  return gulp
    .src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'));
});

gulp.task('html', function() {
  return gulp
    .src('src/*.html')
    .pipe(minifyhtml())
    .pipe(gulp.dest('build'));
});

gulp.task('linter', function() {
  return gulp
    .src('src/styles/*.css')
    .pipe(
      stylelint({
        fix: true,
        reportOutputDir: 'reports/lint',
        reporters: [{ formatter: 'string', console: true }],
      })
    )
    .pipe(gulp.dest('src/styles/fix'));
});

gulp.task('build', ['styles', 'html', 'linter', 'images']);

const browserSync = require('browser-sync');
const reload = browserSync.reload;

// watch files for changes and reload
gulp.task('serve', ['styles', 'html', 'images'], function() {
  browserSync({
    server: {
      baseDir: 'build',
    },
  });

  gulp.watch(['*.html', 'styles/**/*.css', 'images/**/*'], { cwd: 'src' }, [
    'styles',
    'html',
    'images',
    'reload',
  ]);
});

gulp.task('reload', reload);
