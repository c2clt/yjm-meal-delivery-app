const mongooes = require("mongoose");
const Schema = mongooes.Schema;

let db = mongooes.createConnection(process.env.MONGODB_KEY,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }, (err) => {
        if(err) {
            console.log(`The was an error connecting the database: ${err}`);
        }
        else {
            console.log(`Successfully connected to the database!`);
        }
    }
);

// define a package Schema
let packageSchema = new Schema({
    "title":  {
        type: String,
        unique: true
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
let Package = db.model("mealPackages", packageSchema);

/*
// populate the local packages created
for (var i = 0; i < allPackages.length; i++){
    let local = new Package({
        title: allPackages[i].title,
        price: allPackages[i].price,
        category: allPackages[i].category,
        numOfMeals: allPackages[i].numOfMeals,
        content:allPackages[i].content,
        isTop: allPackages[i].isTop,
        image: allPackages[i].image
    });

    local.save((err, data) => {
        if(err) {
            console.log(`There was an error saving the local package: ${err}`);
        }
        else {
            console.log(`${data.title} was saved`);
        }
    });
} */


module.exports.addPackage = function(packageData) {
    return new Promise(function(resolve, reject) {
        if(packageData.isTop == "") {
            packageData.isTop = true;
        }
        else {
            packageData.isTop = false;
        }
        let newPackage = new Package(packageData);
        console.log(newPackage);
        if(newPackage) {
            newPackage.save((err, data) => {
                if(err) {
                    reject(`There was an error saving new meal package: ${err}`);
                }
                else {
                    console.log(`${data.title} was saved.`);
                    resolve();
                }
            });
        }       
    });
}

module.exports.getAllPackagesData = function() {
    return new Promise(function(resolve, reject) {
        Package.find()
        .exec()
        .then((data) => {
            resolve(data);
        })
        .catch((err) => {
            reject(`No data found: ${err}`);
        });
    });
}

module.exports.getTopPackagesData = function() {
    return new Promise(function(resolve, reject) {
        Package.find({isTop: true})
        .exec()
        .then((data) => {
            resolve(data);
        })
        .catch((err) => {
            reject(`No top package found: ${err}`);
        });
    })
}

module.exports.getPackageByTitle = function(packageTtl) {
    return new Promise(function(resolve, reject) {
        Package.findOne({title: packageTtl})
        .exec()
        .then((data) => {
            if(!data) {
                reject(`No package found`);
            }
            else {
                resolve(data);
            }            
        })
        .catch((err) =>{
            reject(`There was an error finding the package: ${err}`);
        });
    });
}

module.exports.updatePackage = function(packageData) {
    return new Promise(function(resolve, reject) {
        if(packageData.isTop) {
            packageData.isTop = true;
        }
        else {
            packageData.isTop = false;
        }

        Package.updateOne({title: packageData.title}, { 
            $set: {
                price: packageData.price,
                category: packageData.category,
                numOfMeals: packageData.numOfMeals,
                content: packageData.content,
                isTop: packageData.isTop,
                image: packageData.image
            }
        })
        .exec()
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(`Cannot update the package (${packageData.title}): ${err}`);
        });
    });
}

module.exports.deletePackageByTitle = function(packageTtl) {
    return new Promise(function(resolve, reject) {
        Package.deleteOne({title: packageTtl})
        .exec()
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(`There was an error deleting the package: ${err}`);
        });
    });
}

