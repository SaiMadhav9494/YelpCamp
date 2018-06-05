var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose= require("mongoose");
var flash=require("connect-flash");
var seedDB= require("./seeds");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");

var commentRoutes=require("./routes/comments");
var campgroundsRoutes=require("./routes/campgrounds");
var authRoutes=require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_v12");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

app.use(express.static(__dirname+"/public"));

app.use(methodOverride("_method"));

app.use(flash());

//seedDB();

var Campground =require("./models/campground");

var Comment=require("./models/comment");

var User=require("./models/user");

//Passport config
app.use(require("express-session")({
    secret:"I do not have any",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

// Campground.create({
//     name:"Salmon creek",
//     image:"https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg",
//     description:"This is a huge creek, no bathrooms. No water. Beautiful view"
// },function(err,campground){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Newly create campground");
//         console.log(campground);
//     }
// });

app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(authRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server has started"); 
});