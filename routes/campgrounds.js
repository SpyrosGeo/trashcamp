var express = require("express");
var router = express.Router();
var Campground = require('../models/campground');


router.get("/", function(req, res) {
  // console.log(req.user);
  //get data from the DB
  Campground.find({},function(err,allCampgrounds) {
    if (err) {
      console.log('error', error);
    } else {
      res.render("campgrounds/index",{campgrounds:allCampgrounds});
    }
  });
});
//NEW-show form
router.get("/new", function(req, res) {
  res.render("campgrounds/new");
});

//CREATE -add new campground to DB
router.post("/", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {
    name: name,
    image: image,
    description: desc
  };
  //create a new campground and save to database
  Campground.create(newCampground,function(err,newlyCreated) {
      if (err) {
        console.log('err', err);
      } else {
          //redirect
        res.redirect("/campgrounds");
      }
  });
});

//Show
  router.get("/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
          console.log('err', err);
        } else {
          // console.log('foundCampground:', foundCampground);
          res.render("campgrounds/show",{campground: foundCampground});
        }
      });
    });

  
module.exports = router;