const mongoose = require("mongoose");

const dropParallelArrayJobIndexes = async () => {
  const JobOpening = require("../models/jobOpeningModel");
  let indexes = [];

  try {
    indexes = await JobOpening.collection.indexes();
  } catch (error) {
    if (error.codeName === "NamespaceNotFound") return;
    throw error;
  }

  const invalidIndexes = indexes.filter((index) => index.key && index.key.location && index.key.skills);
  for (const index of invalidIndexes) {
    await JobOpening.collection.dropIndex(index.name);
    console.log(`Dropped invalid job opening index: ${index.name}`);
  }
};

const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from environment");
  }

  await mongoose.connect(mongoUri);
  await dropParallelArrayJobIndexes();
  console.log("MongoDB connected successfully");
};

module.exports = { connectDb };
