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
router.get("/new", isLoggedIn,function(req, res) {
  res.render("campgrounds/new");
});

//CREATE -add new campground to DB
router.post("/",isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id:req.user._id,
    username:req.user.username
  }
  var newCampground = {
    name: name,
    image: image,
    description: desc,
    author:author
  };
  //create a new campground and save to database
  Campground.create(newCampground,function(err,newlyCreated) {
      if (err) {
        console.log('err', err);
      } else {
          //redirect
          // console.log('newlyCreated', newlyCreated);
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

    // EDIT Campground Route
    router.get("/:id/edit",function (req, res) {
      Campground.findById(req.params.id,function (err,foundCampground) {
        if (err) {
          console.log('err:', err);
        } else {
            res.render("campgrounds/edit",{campground:foundCampground});
        }
      });
    });
    //UPDATE Campground Route
router.put("/:id",function (req, res) {
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err,updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});
//DESTROY Campground Route
router.delete("/:id",function (req, res) {
  Campground.findByIdAndRemove(req.params.id,function (err,campgroundRemoved) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});
// DELETE BOTH COMMENTS AND Campground
// router.delete("/:id", checkCampgroundOwnership, (req, res) => {
//     Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
//         if (err) {
//             console.log(err);
//         }
//         Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
//             if (err) {
//                 console.log(err);
//             }
//             res.redirect("/campgrounds");
//         });
//     })
// });


//Middleware
    function isLoggedIn(req, res, next){
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect("/login");
      }
    }

module.exports = router;
