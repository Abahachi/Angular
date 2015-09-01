/**
 * Created by Asuska on 30.08.2015.
 */
var gulp        = require("gulp"),
    livereload  = require("gulp-livereload"),
    sass        = require("gulp-sass"),
    autoprefixer= require("gulp-autoprefixer"),
    plumber     = require("gulp-plumber"); //Error handler
    concat      = require("gulp-concat"); //define name for combined file
    browserify  = require("browserify");
    vinylSource = require("vinyl-source-stream"); //File renaming
    es          = require("event-stream");

/*
*
* @subtask::SASS->CSS
* @subtask::SCSS + normalize.css
*/


gulp.task("css", function(){
    var vendor = gulp.src('./vendor/normalize-css/normalize.css');
    var bundle = gulp.src('./assets/css/app.scss')
        .pipe(plumber({
                    errorHandler: function(err){
                        console.log(err);
                        this.emit('end')
                    }
                }
              ))
        .pipe(sass())
        .pipe(autoprefixer({
            browser: ['last 10 versions'],
            cascade: true
        }))

    return es.merge(vendor, bundle)
        .pipe(concat('combined.css'))
        .pipe(gulp.dest('./build/'))
        .pipe(livereload());
});

gulp.task("js", function(){
    //Angular
    //D3

    return browserify('./assets/js/bootstrap.js')
        .bundle().on('error', function(err){
            console.log(err.toString());
            return this.emit('end');
        }) //+error handler
        .pipe(vinylSource('combined.js'))
        .pipe(gulp.dest('./build/'))
});


gulp.task("dev", function(){
    livereload.listen();
    gulp.watch([
            './views/*.jade',
            './views/**/*.jade',
            './views/**/**/*.jade'
            ], function(e){}).on('change', livereload.changed);

    gulp.watch([
        './assets/js/*.js',
        './assets/js/**/*.js',
        './assets/js/**/**/*.js',
        './assets/js/**/**/**/*.js'
    ], ['js'], function(e){}).on('change', livereload.changed);

    gulp.watch([
        './assets/css/*.scss',
        './assets/css/**/*.scss'
    ], ['css']);
});