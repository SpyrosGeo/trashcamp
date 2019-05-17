var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');



router.get("/new",isLoggedIn,function(req, res) {
  Campground.findById(req.params.id,function (err,campground) {
      if (err) {
        console.log('err', err);
      } else {
        res.render("comments/new",{campground: campground});
      }
  });
});

router.post("/",isLoggedIn,function(req, res) {
  Campground.findById(req.params.id,function (err,campground) {
      if (err) {
        console.log('err:', err);
        res.status("404");
      } else {
        // console.log(req.body.comment);
        Comment.create(req.body.comment,function(err,comment) {
            if (err) {
              console.log('err:', err);
            } else {
              campground.comments.push(comment);
              campground.save();
              res.redirect("/campgrounds/"+campground._id+"")
            }
        });
      }
  });
});

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}
module.exports = router;