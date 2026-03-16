const express = require('express');
const router = express.Router();
const Skill = require('../models/skill');
const Result = require('../models/result');
const Listing = require('../models/listing');

// ================= COMPUTE MATCH =================
router.post('/compute', async (req, res) => {
  try {
    const { studentId, listingId, studentSkills } = req.body;

    if (!studentId || !listingId || !studentSkills) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    // Fetch the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ status: "error", message: "Listing not found" });
    }

    // Fetch the role's required skills from DB
    const roleSkills = await Skill.find({ listing: listingId });
    if (roleSkills.length === 0) {
      return res.status(400).json({ status: "error", message: "This listing has no skills configured" });
    }

    // ================= THE ALGORITHM =================
    const totalWeight = roleSkills.reduce((sum, s) => sum + s.weight, 0);
    let earnedScore = 0;
    const matchedSkills = [];
    const missingSkills = [];

    for (const req_skill of roleSkills) {
      const student = studentSkills.find(s => s.name === req_skill.name);

      if (!student || student.proficiencyLevel === 0) {
        missingSkills.push({
          name: req_skill.name,
          targetLevel: req_skill.targetLevel
        });
      } else {
        const ratio = Math.min(student.proficiencyLevel / req_skill.targetLevel, 1);
        const contribution = (req_skill.weight / totalWeight) * ratio * 100;
        earnedScore += contribution;

        matchedSkills.push({
          name: req_skill.name,
          studentLevel: student.proficiencyLevel,
          targetLevel: req_skill.targetLevel,
          contribution: Math.round(contribution)
        });
      }
    }

    const score = Math.round(earnedScore);
    const isReady = score >= listing.threshold;

    // ================= SAVE RESULT TO DB =================
    const result = new Result({
      student: studentId,
      listing: listingId,
      score,
      isReady,
      matchedSkills,
      missingSkills
    });

    await result.save();

    return res.status(201).json({
      status: "success",
      result: {
        score,
        isReady,
        threshold: listing.threshold,
        listingTitle: listing.title,
        matchedSkills,
        missingSkills
      }
    });

  } catch (err) {
    console.error("❌ Error computing match:", err);
    return res.status(500).json({ status: "error", message: "Failed to compute match" });
  }
});

// ================= GET STUDENT RESULT HISTORY =================
router.get('/history/:studentId', async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.studentId })
      .populate('listing', 'title threshold')
      .sort({ createdAt: -1 });

    return res.json({ status: "success", results });
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    return res.status(500).json({ status: "error", message: "Failed to fetch history" });
  }
});

module.exports = router;