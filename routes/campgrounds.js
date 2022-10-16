const express = require('express');

const router = express.Router();

const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Campground data missing', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made new campground');
    res.redirect(`/campgrounds/${campground.id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
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
}));

router.put('/:id', isLoggedIn, validateCampground, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    await campground.save();
    req.flash('success', `Successfully updated campground ${campground.title}!`);
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const deletedCampground = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', `Successfully deleted campground ${deletedCampground.title}!`);
    res.redirect(`/campgrounds`);
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

module.exports = router;