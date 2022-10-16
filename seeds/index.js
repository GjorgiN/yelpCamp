const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Cannot seed data, connection error:'));
db.once('open', () => console.log('Database connected to seed data'));

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {

    console.log('Deleting all campgrounds...')
    await Campground.deleteMany({});
    await Review.deleteMany({});
    console.log('Deleting all campgrounds successfully completed!');

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: sample(descriptors) + ' ' + sample(places),
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            imageUrl: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam, praesentium. Praesentium facere dolore suscipit, rerum, nisi assumenda placeat tempora illum facilis accusantium, odio soluta molestias qui ab sed tenetur quibusdam.',
            price: randomPrice,
            author: '63488ca5f65d4db69988205c'
        });
        await camp.save();
    }
}

seedDb().then(() => mongoose.connection.close(false, () => console.log('DB seeding connection closed')));