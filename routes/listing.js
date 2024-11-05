const express = require('express');
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync.js'); 
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Route to list all listings
router.route("/")
    .get(WrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, WrapAsync(listingController.createListing));

// Route to render a new listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Route to handle specific listing by ID
router.route("/:id")
    .get(WrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, WrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, WrapAsync(listingController.destroyListing));

// Route to render the edit form for a listing
router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync(listingController.renderEditForm));

// Admin route to manage all listings (optional)
router.get("/admin", isLoggedIn, async (req, res) => {
    // Check if the user is an admin
    if (res.locals.currUser.role !== 'admin') {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect('/listings');
    }
    const listings = await Listing.find({});
    res.render('admin/dashboard', { listings }); // Render the admin dashboard with all listings
});

module.exports = router;
