var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass')(require('sass'));

gulp.task('sass', function() {
    return gulp.src('app/assets/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.stream())
});

gulp.task('serve', gulp.series('sass', function() {
    browserSync.init({
        server: './app/'
    });

    gulp.watch('app/assets/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('app/*html').on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));