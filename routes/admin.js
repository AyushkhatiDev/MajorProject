// routes/admin.js
const express = require('express');
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync.js');
const { isLoggedIn, isOwner } = require('../middleware.js');
const Listing = require('../models/listing.js');

// Admin Dashboard Route
router.get('/dashboard', isLoggedIn, async (req, res) => {
    if (res.locals.currUser.role !== 'admin') {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect('/listings');
    }
    const listings = await Listing.find({});
    res.render('admin/dashboard', { listings });
});

module.exports = router;
