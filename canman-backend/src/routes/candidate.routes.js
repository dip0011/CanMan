const express = require("express");
const router = new express.Router();

const auth = require("../middleware/auth");
const Candidate = require("../db/models/candidate");

router.get("/landing", auth, async (req, res) => {
  try {
    const candidates = await Candidate.find({});
    res.status(200).send({
      success: true,
      message: "Fetched All Candidates successful",
      candidates,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message || "Failed to fetch Candidates",
    });
  }
});

router.post("/landing/candidate", auth, async (req, res) => {
  const exsitingCandidate = await Candidate.findOne({ email: req.body.email });
  if (exsitingCandidate) {
    return res.status(400).send({
      success: false,
      message: "Candidate is already Created!",
    });
  }
  const candidate = new Candidate(req.body);
  try {
    await candidate.save();
    res.status(201).send({
      success: true,
      message: "Candidate Created successful",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message || "Candidate Creation failed",
    });
  }
});

router.put("/landing/candidate", auth, async (req, res) => {
  const candidate = await Candidate.findOne({ email: req.body.email });

  const updates = Object.keys(req.body);
  const allowedUpdate = ["name", "email", "result", "DOB"];
  const isValidOperation = updates.every((update) =>
    allowedUpdate.includes(update)
  );

  if (!isValidOperation) {
    return res.status(412).send({
      success: false,
      Message: "Invalid Updates!",
    });
  }
  try {
    updates.forEach((update) => (candidate[update] = req.body[update]));
    await candidate.save();
    res.status(202).send({
      success: true,
      Message: "Candidate Updated Successfully!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      Message: error.message || "Error in Updating Candidate!",
    });
  }
});

router.delete("/landing/candidate/:id", auth, async (req, res) => {
  const email = req.params.id;
  const candidate = await Candidate.findOne({ email });
  try {
    await candidate.remove();
    res.status(200).send({
      success: true,
      message: "Candidate Removed successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Error in Removing candidate!",
    });
  }
});

module.exports = router;
