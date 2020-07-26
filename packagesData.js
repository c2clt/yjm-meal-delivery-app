const mongooes = require("mongoose");
const Schema = mongooes.Schema;

// define a package Schema
let packageSchema = new Schema({
    "title":  {
        type: String,
        unique: ture
    },
    "price": Number,
    "category": String,
    "numOfMeals": Number,
    "content": String,
    "isTop": Boolean,
    "image": String,
});

// register Package model using the userScehma
// use the  collection in the db to store documents
let Package;
module.exports.initialize = function() {
    return new Promise(function (resolve, reject) {
        let webDB = mongooes.createConnection(process.env.MONGODB_KEY,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            });

        webDB.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });

        webDB.once('open', ()=>{
            console.log(`Successfully connected to the database`);
            Package = webDB.model("mealPackages", packageSchema);
            resolve();
        });
    });
};

module.exports.addPackage = function(packageData) {
    return new Promise(function(resolve, reject) {
        packageData.isTop = (packageData.isTop) ? true : false;

        
    });
}

