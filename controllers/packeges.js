const express = require("express");
const router = express.Router();

//load packagesModle
const packagesModle = require("../models/packages.js");

// list All Meal Packages
router.get("/mealList", (req, res)=>{
    res.render("packages/mealList", {
        title: "Meal Package Page",
        packages: packagesModle.getAllPackages()
    });
});

module.exports = router;