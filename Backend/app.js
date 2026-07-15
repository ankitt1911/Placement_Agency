const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { connectDb } = require("./config/db");

const authRouter = require("./router/authRoutes");
const profileRouter = require("./router/profileRoutes");
const jobRouter = require("./router/jobRoutes");
const applicationRouter = require("./router/applicationRoutes");
const dashboardRouter = require("./router/dashboardRoutes");
const companyRouter = require("./router/companyRoutes");
const opsStudentRouter = require("./router/opsStudentRoutes");
const opsJobRouter = require("./router/opsJobRoutes");
const opsApplicationRouter = require("./router/opsApplicationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));
app.use("/uploads", express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads/local")));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is healthy", statusCode: 200 });
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/companies", companyRouter.publicRouter);
app.use("/api/ops/companies", companyRouter.opsRouter);
app.use("/api/ops/students", opsStudentRouter);
app.use("/api/ops/jobs", opsJobRouter);
app.use("/api/ops/applications", opsApplicationRouter);
app.use("/api/ops/dashboard", dashboardRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found", statusCode: 404 });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    statusCode: err.statusCode || 500,
  });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });

module.exports = app;
