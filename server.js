/**
 * Created by Asuska on 30.08.2015.
 */
var express = require("express");
var app     = express();
var router  = express.Router();
var path    = require("path");

app.set('view engine', 'jade');

app.disable('x-powered-by');

app.use('/build', express.static(path.join(__dirname,'build'), {
    maxAge: 5000 * 1000
    }
))
app.use('/vendor', express.static(path.join(__dirname,'vendor')));

app.get('/kit', function(req, res){
    res.render('main', {
        pageTitle: "main page"
    });
});

app.use('/', router);

app.listen(8080);