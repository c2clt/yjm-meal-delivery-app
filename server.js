const express = require("express");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const bodyParser = require("body-parser");
const clientSessions = require("express-session");

// Import function exported by newly installed node modules.
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

// load the enironment variable file
require("dotenv").config({path: "./config/keys.env"});

const app = express();

//Handlebars middleware (This tells Express to set handlebars as the template engine)
app.engine("handlebars", exphbs({handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set("view engine", "handlebars");

app.use(express.static("public"));

//This tell express to make form data available via req.body in ever request
app.use(bodyParser.urlencoded({extended: false}));

// Setup client-sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_A7", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
    resave: true,
    saveUninitialized: true
  }));
  
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