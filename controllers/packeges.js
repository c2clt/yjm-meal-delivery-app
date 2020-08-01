const express = require("express");
const router = express.Router();
const packageDataService = require("../packagesData.js");
const clientSessions = require("express-session");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const PHOTODIRECTORY = "./public/img/uploaded";


//make sure the photos folder exists
if(!fs.existsSync(PHOTODIRECTORY)) {
    console.log("Not found directory");
    fs.mkdirSync(PHOTODIRECTORY);
}

// Setup client-sessions
router.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_A7", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
    resave: true,
    saveUninitialized: true
  }));

  // multer requires a few options to be setup to store files with file extensions
const storage = multer.diskStorage({
    destination: PHOTODIRECTORY,
    filename: (req, file, cd) => {
        cd(null, Date.now() + path.extname(file.originalname));
    }
});

// tell multer to use the diskStorage function for naming files instead of the default
const upload= multer({ storage: storage });

// This is a helper middleware function that checks if a user is logged in
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/forms/login");
    } else {
      next();
    }
}

// list All Meal Packages
router.get("/mealList", (req, res)=>{
    packageDataService.getAllPackagesData().then((data) => {
        res.render("packages/mealList", {
            title: "Meal Package Page",
            packages: data                         
        });  
    });    
      
});

// add new package route
router.get("/add", ensureLogin, (req, res) => {
    res.render("packages/addPackage", {
        title: "Add new package"
    });
});

router.post("/add", ensureLogin, (req, res) => {
    packageDataService.addPackage(req.body).then(() => {
        res.redirect("/packages/mealList");
    })
    .catch((err) => {
        res.status(500).send(`Unable to add the package: ${err}`);
    });
});

router.get("/mealTable", ensureLogin, (req, res) => {
    packageDataService.getAllPackagesData().then((data) => {
        res.render("packages/mealTable", {
            title: "Meal List Page",
            packages: data                         
        });  
    });   
});

router.get("/package/:title", ensureLogin, (req, res) => {
    let viewPackage = {};
    packageDataService.getPackageByTitle(req.params.title).then((data) => {
        if (data) {
            viewPackage = data;
            res.render("packages/package", {
                title: "Package Page",
                viewData: viewPackage
            });
        }
        else {
            viewPackage = null;
        }
    }).catch((err) => {
        viewPackage = null;
        console.log(`There was an error: ${err}`);
    });
});

router.post("/package/update", ensureLogin, (req, res) => {
    packageDataService.updatePackage(req.body).then(() => {
        res.redirect("/packages/mealTable");
    }).catch((err) => {
        res.status(500).send(`Enable to find the package" ${err}`);
    });
});

router.get("/delete/:title", ensureLogin, (req, res) => {
    packageDataService.deletePackageByTitle(req.params.title).then(() => {
        res.redirect("/packages/mealTable");
    }).catch((err) => {
        res.status(500).send(`Unable to delete the package: ${err}`);
    });
});

router.get("/photos", ensureLogin, (req, res) => {
    fs.readdir(PHOTODIRECTORY, (err, data) => {
        if (!err) {
            res.render("packages/photos", {
                title: "Packages Photos Page",
                photos: data
            });
        }
        else {
            console.log(`There was an error reading the photos from file: ${err}`);
        }
    });    
});

router.get("/photos/add", ensureLogin, (req, res) => {
    res.render("packages/addPhoto", {
        title: "Add Photo Page"
    });
});

router.post("/photos/add", ensureLogin, upload.single("photoFile"), (req, res) => {
    res.redirect("/packages/photos");
});

router.get("/shopping basket", ensureLogin, (req, res) => {

});

module.exports = router;