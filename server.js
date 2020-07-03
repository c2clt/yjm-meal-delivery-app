const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

//Handlebars middleware (This tells Express to set handlebars as the template engine)
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));

//load controllers
const generalController = require("./controllers/general.js");
const mealPackagesController = require("./controllers/packeges.js");

//map each controller to the app
app.use("/", generalController);
app.use("/packages", mealPackagesController);

//set up server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Web server is up and running!`);
})