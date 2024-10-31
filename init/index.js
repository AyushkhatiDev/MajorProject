const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/HavenX';

main()
   .then(() => {
    console.log('Database connected');
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '671898bce3d1db53bfb29f9d'}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized");
};



initDB();
 