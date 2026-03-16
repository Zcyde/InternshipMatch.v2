const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// ================= GET ALL PUBLISHED LISTINGS (Student view) =================
router.get('/published', async (req, res) => {
  try {
    const listings = await Listing.find({ isPublished: true });
    return res.json({ status: "success", listings });
  } catch (err) {
    console.error("❌ Error fetching published listings:", err);
    return res.status(500).json({ status: "error", message: "Failed to fetch listings" });
  }
});

// ================= GET ALL LISTINGS (Admin view) =================
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    return res.json({ status: "success", listings });
  } catch (err) {
    console.error("❌ Error fetching listings:", err);
    return res.status(500).json({ status: "error", message: "Failed to fetch listings" });
  }
});

// ================= GET SINGLE LISTING =================
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ status: "error", message: "Listing not found" });
    }
    return res.json({ status: "success", listing });
  } catch (err) {
    console.error("❌ Error fetching listing:", err);
    return res.status(500).json({ status: "error", message: "Failed to fetch listing" });
  }
});

// ================= CREATE LISTING (Admin) =================
router.post('/', async (req, res) => {
  try {
    const { title, description, threshold, isPublished } = req.body;

    if (!title || threshold === undefined) {
      return res.status(400).json({ status: "error", message: "Title and threshold are required" });
    }

    const newListing = new Listing({ 
      title, 
      description, 
      threshold,
      isPublished: isPublished || false
    });
    await newListing.save();

    return res.status(201).json({ status: "success", listing: newListing });
  } catch (err) {
    console.error("❌ Error creating listing:", err);
    return res.status(500).json({ status: "error", message: "Failed to create listing" });
  }
});

// ================= UPDATE LISTING (Admin) =================
router.put('/:id', async (req, res) => {
  try {
    const { title, description, threshold, isPublished } = req.body;

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { title, description, threshold, isPublished },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ status: "error", message: "Listing not found" });
    }

    return res.json({ status: "success", listing: updated });
  } catch (err) {
    console.error("❌ Error updating listing:", err);
    return res.status(500).json({ status: "error", message: "Failed to update listing" });
  }
});

// ================= DELETE LISTING (Admin) =================
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Listing not found" });
    }

    return res.json({ status: "success", message: "Listing deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting listing:", err);
    return res.status(500).json({ status: "error", message: "Failed to delete listing" });
  }
});

module.exports = router;
