const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  industry: String,
  locations: [String],
  website: String,
  logo: String,
  description: String,
  documents: [String],
  contactPerson: {
    name: String,
    email: String,
    phone: String,
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

companySchema.index({ name: 1, industry: 1 });
companySchema.index({ isActive: 1 });

module.exports = mongoose.model("Company", companySchema);
