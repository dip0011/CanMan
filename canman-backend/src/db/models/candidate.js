const mongoose = require("mongoose");
const validator = require("validator");

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid!");
        }
      },
    },
    DOB: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      enum: ["SHORTLIST", "REJECTED"],
      default: "SHORTLIST",
    },
  },
  {
    timestamps: true,
  }
);

// Create CANDIDATE collection
const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
