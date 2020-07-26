const express = require("express");
const router = express.Router();
const packageDataService = require("../packagesData.js");

packageDataService.initialize();
//load packagesModle
const packagesModle = require("../models/packages.js");
// list All Meal Packages
router.get("/mealList", (req, res)=>{    
    res.render("packages/mealList", {
        title: "Meal Package Page",
        packages: packagesModle.getAllPackages()
    });    
});

router.get("/add", (req, res) => {
    res.render("packages/addPackage");
});

router.post("/add", (req, res) => {

});

module.exports = router;