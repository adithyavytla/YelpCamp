var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require('./seeds');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var methodOverride = require('method-override');

// Requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
// mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true});
mongoose.connect(process.env.DATABASEURL,{
    useNewUrlParser: true,
    useCreateIndex: true
    }).then(() => {
	       console.log("Connected to DB!");
    }).catch(err => {
	       console.log("Error: ", err.message);
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();//seed the database

// Passport Configuration
app.use(require('express-session')({
    secret: "Laugh tale is the last island in onepiece",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT||3000,function(){
    console.log("server has started!!!");
});
