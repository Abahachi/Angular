/**
 * Created by Asuska on 30.08.2015.
 */
var gulp        = require("gulp"),
    livereload  = require("gulp-livereload"),
    sass        = require("gulp-sass"),
    autoprefixer= require("gulp-autoprefixer"),
    concat      = require("gulp-concat");

gulp.task("css", function(){

});

gulp.task("dev", function(){
    livereload.listen();
    gulp.watch([
            'assets/css/*.scss'
        ],
    function(event){}).on('change', livereload.changed())
});

