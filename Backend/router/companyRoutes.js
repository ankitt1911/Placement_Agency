const express = require("express");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { getCompanies, getCompanyFilterOptions, createCompany, getCompanyDetail, updateCompany, deleteCompany, toggleCompany, exportCompanies, publicCompanies } = require("../controllers/companyController");

const publicRouter = express.Router();
const opsRouter = express.Router();

publicRouter.get("/public", publicCompanies);

opsRouter.get("/", jwtMiddleware, getCompanies);
opsRouter.post("/", jwtMiddleware, createCompany);
opsRouter.get("/export", jwtMiddleware, exportCompanies);
opsRouter.get("/filter-options", jwtMiddleware, getCompanyFilterOptions);
opsRouter.get("/:id", jwtMiddleware, getCompanyDetail);
opsRouter.put("/:id", jwtMiddleware, updateCompany);
opsRouter.delete("/:id", jwtMiddleware, deleteCompany);
opsRouter.patch("/:id/toggle", jwtMiddleware, toggleCompany);

module.exports = { publicRouter, opsRouter };
