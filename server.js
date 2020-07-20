const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");


// load the enironment variable file
require("dotenv").config({path: "./config/keys.env"});

const app = express();

//Handlebars middleware (This tells Express to set handlebars as the template engine)
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));

//This tell express to make form data available via req.body in ever request
app.use(bodyParser.urlencoded({extended: false}));

// This is a helper middleware function that checks if a user is logged in
// we can use it in any route that we want to protect against unauthenticated access.
// A more advanced version of this would include checks for authorization as well after
// checking if the user is authenticated
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
}

//load controllers
const generalController = require("./controllers/general.js");
const mealPackagesController = require("./controllers/packeges.js");
const formsController = require("./controllers/forms.js");

//map each controller to the app
app.use("/", generalController);
app.use("/packages", mealPackagesController);
app.use("/forms", formsController)

//set up server
const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Web server is up and running!`);
});