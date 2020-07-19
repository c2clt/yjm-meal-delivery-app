const mongooes = require("mongoose");
const bcypt = require("bcryptjs");

// load the enironment variable file for MONGODB_KEY
require("dotenv").config({path: "./config/keys.env"});

mongooes.createConnection(process.env.MONGODB_KEY,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (err) => {
        if(err) {
            console.log("MongoDB connect failed: " + err);
        }
        else {
            console.log("MongoDB connection is successful！");
        }
    });

const userSchema = new mongooes.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: {
        type: String,
        unique: true
    },
    password: String
});