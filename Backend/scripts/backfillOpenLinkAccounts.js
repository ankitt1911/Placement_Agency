// One-off backfill: users created by the open link apply flow before `accountSource`/`isClaimed`
// existed are indistinguishable from real signups, which locks them out of registering. This marks
// them as unclaimed so they can claim their account and auto sync their earlier applications.
//
// Run once with: npm run backfill:open-link

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const { connectDb } = require("../config/db");
const User = require("../models/userModel");
const Application = require("../models/applicationModel");

const run = async () => {
  await connectDb();

  const openLinkStudentIds = await Application.distinct("student", { appliedFromOpenLink: true });
  if (!openLinkStudentIds.length) {
    console.log("No open link applications found, nothing to backfill");
    return;
  }

  // Anyone who has logged in already set their own password, so their account is genuinely claimed.
  const result = await User.updateMany(
    { _id: { $in: openLinkStudentIds }, role: "student", lastLogin: { $in: [null, undefined] } },
    { $set: { accountSource: "open-link", isClaimed: false } }
  );

  console.log(`Open link applicants: ${openLinkStudentIds.length}`);
  console.log(`Marked unclaimed: ${result.modifiedCount}`);
};

run()
  .catch((error) => {
    console.error("Backfill failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());
