var express    = require("express");
var app        = module.exports = express();
// Setting view folder for single index.html file
// app.set("views", "./public");
app.engine('text', require('ejs').renderFile);

// // Serve all js, css, html from the public folder
// app.use(express.static(__dirname + '/public'));


// // Serving bower_components from root. Might change to public later
// app.use('/bower_components', express.static(__dirname + '/bower_components'));



// var routes = require('./config/routes');
app.get('/', function (req,res) {
	res.render('boo');
});
app.listen(process.env.PORT || 5000);