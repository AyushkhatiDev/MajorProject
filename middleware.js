const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a new listing!");
        return res.redirect("/login");
    }
    next();
};

// Save redirect URL for login redirection
module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Check if user is the owner of the listing or an admin
module.exports.isOwner = (req, res, next) => {
    const { user } = req;
    Listing.findById(req.params.id)
        .then(listing => {
            if (!listing) {
                return next(new ExpressError('Listing not found', 404));
            }
            if (!listing.author.equals(user._id) && !user.isAdmin) {
                return next(new ExpressError('You do not have permission to do that', 403));
            }
            next();
        })
        .catch(err => next(err));
};

// Validate listing data against schema
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } 
    next();
};

// Validate review data against schema
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// Check if the user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
