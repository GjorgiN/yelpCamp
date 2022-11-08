const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg, png, jpg, svg']
    }
})

// different because cloudinary api is used without multer-storage-cloudinary in users routes and controller
const storageUsers = {
    folder: 'YelpCamp/users',
}

module.exports = {
    cloudinary,
    storage,
    storageUsers
}