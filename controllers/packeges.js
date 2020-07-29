const express = require("express");
const router = express.Router();
const packageDataService = require("../packagesData.js");
const clientSessions = require("express-session");

// Setup client-sessions
router.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_A7", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
    resave: true,
    saveUninitialized: true
  }));

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
router.get("/add", (req, res) => {
    res.render("packages/addPackage", {
        title: "Add new package"
    });
});

router.post("/add", (req, res) => {
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

router.get("/shopping basket", ensureLogin, (req, res) => {

});

module.exports = router;