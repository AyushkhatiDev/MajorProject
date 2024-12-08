const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({})
            .populate('owner', 'username')
            .populate({
                path: 'reviews',
                populate: { path: 'author', select: 'username' }
            });
        res.json(allListings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                    select: "username"
                },
            })
            .populate("owner", "username");
        
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch listing" });
    }
};

module.exports.createListing = async (req, res) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        res.status(400).json({ error: "Failed to create listing" });
    }
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }
        
        res.json(listing);
    } catch (err) {
        res.status(400).json({ error: "Failed to update listing" });
    }
};

module.exports.destroyListing = async (req, res) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.json({ message: "Successfully deleted listing" });
    } catch (err) {
        res.status(400).json({ error: "Failed to delete listing" });
    }
};