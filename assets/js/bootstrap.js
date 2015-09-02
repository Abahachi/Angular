require("../../vendor/angular/angular")
require("./modules/d3")
require("./modules/directives")

angular.module('kitApp', ['d3', 'kitApp.directives']);
