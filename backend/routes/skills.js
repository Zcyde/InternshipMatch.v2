const express = require('express');
const router = express.Router();
const Skill = require('../models/skill');

// ================= GET SKILLS BY LISTING (Student & Admin) =================
router.get('/:listingId', async (req, res) => {
  try {
    const skills = await Skill.find({ listing: req.params.listingId });
    return res.json({ status: "success", skills });
  } catch (err) {
    console.error("❌ Error fetching skills:", err);
    return res.status(500).json({ status: "error", message: "Failed to fetch skills" });
  }
});

// ================= CREATE SKILL (Admin) =================
router.post('/', async (req, res) => {
  try {
    const { name, listing, weight, targetLevel } = req.body;

    if (!name || !listing || !weight || !targetLevel) {
      return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    const newSkill = new Skill({ name, listing, weight, targetLevel });
    await newSkill.save();

    return res.status(201).json({ status: "success", skill: newSkill });
  } catch (err) {
    console.error("❌ Error creating skill:", err);
    return res.status(500).json({ status: "error", message: "Failed to create skill" });
  }
});

// ================= UPDATE SKILL (Admin) =================
router.put('/:id', async (req, res) => {
  try {
    const { name, weight, targetLevel } = req.body;

    const updated = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, weight, targetLevel },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ status: "error", message: "Skill not found" });
    }

    return res.json({ status: "success", skill: updated });
  } catch (err) {
    console.error("❌ Error updating skill:", err);
    return res.status(500).json({ status: "error", message: "Failed to update skill" });
  }
});

// ================= DELETE SKILL (Admin) =================
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Skill.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Skill not found" });
    }

    return res.json({ status: "success", message: "Skill deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting skill:", err);
    return res.status(500).json({ status: "error", message: "Failed to delete skill" });
  }
});

module.exports = router;
