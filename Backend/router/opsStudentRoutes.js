const express = require("express");
const opsStudentRouter = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getStudents, getStudentFilterOptions, getStudentDetail, updateStudent, disableStudent, deleteStudent, downloadStudentResume, generateStudentResume, exportStudents } = require("../controllers/opsStudentController");

opsStudentRouter.get("/", jwtMiddleware, getStudents);
opsStudentRouter.get("/export", jwtMiddleware, exportStudents);
opsStudentRouter.get("/filter-options", jwtMiddleware, getStudentFilterOptions);
opsStudentRouter.get("/:id", jwtMiddleware, getStudentDetail);
opsStudentRouter.put("/:id", jwtMiddleware, updateStudent);
opsStudentRouter.patch("/:id/disable", jwtMiddleware, disableStudent);
opsStudentRouter.delete("/:id", jwtMiddleware, deleteStudent);
opsStudentRouter.get("/:id/resume", jwtMiddleware, downloadStudentResume);
opsStudentRouter.get("/:id/resume-pdf", jwtMiddleware, generateStudentResume);

module.exports = opsStudentRouter;
