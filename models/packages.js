const packages = {
    fakeDB: [],
    
    initPackages() {
        //Protein
        this.fakeDB.push({ image: "protein1.jpg",
                                title: "Beef Salad", 
                                price: 12, 
                                category: "Muscle Gain", 
                                numOfMeals: 4, 
                                content:"Beef, Cucumber, Tomato, Rice, Vege", 
                                isTop: false });
        this.fakeDB.push({ image: "protein2.jpg",
                                title: "Hot Diced Beef", 
                                price: 20, 
                                category: "Muscle Gain", 
                                numOfMeals: 4, 
                                content:"Hot Beef, Tomato Omelet, Sesame Rice, Vege", 
                                isTop: false });
        this.fakeDB.push({ image: "protein3.jpg",
                                title: "High-Protein Chicken", 
                                price: 18, 
                                category: "Muscle Gain", 
                                numOfMeals: 4, 
                                content:"Chicken, Beans, Egg, Vege", 
                                isTop: false });
        this.fakeDB.push({ image: "protein4.jpg",
                                title: "Chicken-Eggplant", 
                                price: 15, 
                                category: "Muscle Gain", 
                                numOfMeals: 5, 
                                content:"Chicken, Fried Eggplant, Egg, Rice, Vege", 
                                isTop: false });
        this.fakeDB.push({ image: "top4.jpg",
                                title: "High-Protein Meal", 
                                 price: 15, 
                                 category: "Muscle Gain", 
                                 numOfMeals: 4, 
                                 content:"Chicken Chop, Egg, Beef, Vege", 
                                 isTop: true });
        //Veggie
        this.fakeDB.push({ image: "veg1.jpg", 
                               title: "Tofu-Purple Rice", 
                               price: 15, 
                               category: "Veggie", 
                               numOfMeals: 3, 
                               content:"Purple Rice, Fried Tofu, Broccoli", 
                               isTop: false });
        this.fakeDB.push({ image: "veg2.jpg", 
                               title: "Avocado-Chickpea", 
                               price: 17, 
                               category: "Veggie", 
                               numOfMeals: 4, 
                               content:"Avocado, Chickpea, Rice, Vege", 
                               isTop: false });
        this.fakeDB.push({ image: "veg3.jpg", 
                             title: "Yam-Veg Salad", 
                             price: 14, 
                             category: "Veggie", 
                             numOfMeals: 4, 
                             content:"Purple Yam, Pumpkin, Carrot, Cucumber", 
                             isTop: false });
        this.fakeDB.push({ image: "veg4.jpg", 
                             title: "Tofu-Veg Salad", 
                             price: 10, 
                             category: "Veggie", 
                             numOfMeals: 5, 
                             content:"Deep Fried Tofu, Okra, Bun, Vege", 
                             isTop: false });
        this.fakeDB.push({ image: "top2.jpg",
                             title:"Vege Meal", 
                              price: 10, 
                              category: "Veggie", 
                              numOfMeals: 4, 
                              content:"Purple Yam, Carrot, Dofu, Bitter Melon", 
                              isTop: true });
        this.fakeDB.push({ image: "top3.jpg",
                             title:"Celery-Tomato", 
                              price: 12, 
                              category: "Veggie", 
                              numOfMeals: 4, 
                              content:"Rice-Corn, Celery, Tomato, Fried Egg",
                              isTop: true });
        //Cartoon
        this.fakeDB.push({ image: "kids1.jpg", 
                                title: "Kitty with Sausage", 
                                price: 15, 
                                category: "Cartoon", 
                                numOfMeals: 5, 
                                content:"Kitty Rice, Sausage, Egg Rolls, Veg, Dried Cranberry", 
                                isTop: false });
        this.fakeDB.push({ image: "kids2.jpg", 
                                title: "Bunny with Bacon", 
                                price: 15, 
                                category: "Cartoon", 
                                numOfMeals: 4, 
                                content:"Bunny Rice, Bacon Rolls, Banana, Veg", 
                                isTop: false });
        this.fakeDB.push({ image: "kids3.jpg", 
                                title: "Kitty with Chicken", 
                                price: 13, 
                                category: "Cartoon", 
                                numOfMeals: 4, 
                                content:"Double-Kitty Rice, Chicken Nuggets, Lotus Root, Veg", 
                                isTop: false });
        this.fakeDB.push({ image: "kids4.jpg", 
                                title: "Doggy with Chicken", 
                                price: 15, 
                                category: "Cartoon", 
                                numOfMeals: 4, 
                                content:"Mixed Doggy Rice, Egg Rolls, Chicken Wings, Vege", 
                                isTop: false });
        this.fakeDB.push({ image: "top1.jpg",
                                title:"Kitty Rice", 
                                 price: 12, 
                                 category: "Cartoon", 
                                 numOfMeals: 4, 
                                 content:"Rice, Chicken, Vege, Spaghetti", 
                                 isTop: true });
        //Others 
        this.fakeDB.push({ image: "other1.jpg", 
                            title: "Meat Balls Meal", 
                            price: 15, 
                            category: "Others", 
                            numOfMeals: 5, 
                            content:"Meat Balls, Egg Rolls, Lotus Root, Rice, Veg", 
                            isTop: false });
        this.fakeDB.push({ image: "other2.jpg", 
                             title: "Cola Chicken", 
                             price: 17, 
                             category: "Others", 
                             numOfMeals: 3, 
                             content:"Cola Chicken, vermicelli salad, Brown Rice", 
                             isTop: false });
        this.fakeDB.push({ image: "other3.jpg",
                             title: "Chicken Wings Meal", 
                             price: 18, 
                             category: "Ohters", 
                             numOfMeals: 4, 
                             content:"Chicken Wings, Broccoli, Sesame Rice, Veg", 
                             isTop: false });
        this.fakeDB.push({ image: "other4.jpg",
                             title: "Chicken Nuggets Meals", 
                             price: 13, 
                             category: "Others", 
                             numOfMeals: 3, 
                             content:"Chicken Nuggets, Rice, Veg", 
                             isTop: false });    
    },

    getAllPackages() {
        return this.fakeDB;
    },

    getTopPackage() {
        const topPackeges = [];
        this.fakeDB.forEach(element=>{
            if (element.isTop === true) {
                topPackeges.push(element);
            }
        });

        return topPackeges;
    }
};

packages.initPackages();
module.exports = packages;