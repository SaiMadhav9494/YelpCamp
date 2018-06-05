var middlewareObj={};
var Campground=require("../models/campground");
var Comment=require("../models/comment");

middlewareObj.checkCampgroundOwnership=function(req,res,next){
    //is user logged in
    if(req.isAuthenticated()){
      Campground.findById(req.params.id,function(err,foundcampground){
        if(err){
            req.flash("error","Campground not found");
            res.redirect("back");
        }
        else{
            // console.log(foundcampground.author.id);
            // console.log(req.user._id);
            if(foundcampground.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error","You don't have permission to do that");
                res.redirect("back");
            }
        }
     });  
    }
    else{
        req.flash("You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentsOwnership=function(req,res,next){
    //is user logged in
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err){
            res.redirect("back");
        }
        else{
            // console.log(foundcampground.author.id);
            // console.log(req.user._id);
            if(foundcomment.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("You are not permitted to do that");
                res.redirect("back");
            }
        }
     });  
    }
    else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in first to access that");
    res.redirect("/login");
}

module.exports= middlewareObj;