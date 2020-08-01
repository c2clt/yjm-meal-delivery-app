const express = require("express");
const router = express.Router();
const packageDataService = require("../packagesData.js");

//home route
router.get("/", (req, res)=>{
    packageDataService.getTopPackagesData().then((data) => {
        res.render("general/home", {
            title: "Home Page",
            topPackages: data
        });
    });
    
});

module.exports = router;