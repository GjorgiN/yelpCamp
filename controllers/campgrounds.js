const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // console.log(req.files);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
    }).send();

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made new campground');
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.showCampground = async (req, res) => {
    console.log(req.user);
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    const newImages = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campground.images.push(...newImages);

    const { deleteImages } = req.body;
    if (deleteImages) {
        for (const imgFilename of deleteImages) {
            await cloudinary.uploader.destroy(imgFilename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } });
    }

    await campground.save();
    req.flash('success', `Successfully updated campground ${campground.title}!`);
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const deletedCampground = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', `Successfully deleted campground ${deletedCampground.title}!`);
    res.redirect(`/campgrounds`);
}