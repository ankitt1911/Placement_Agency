import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Copy, X } from "lucide-react";
import CustomButton from "../../custom/customButton";
import { handleGetCompanies } from "../../../Services/apiCalling/companyApis";
import { handleCloseOpeningOpenLink, handleCreateOpening, handleDeleteOpening, handleDuplicateOpening, handleExportApplicants, handleGetOperationsOpeningFilterOptions, handleGetOperationsOpenings, handleSetOpeningStatus, handleUpdateOpening, handleUpdateOpeningOpenLink } from "../../../Services/apiCalling/jobOpeningManagementApis";
import { isRequired } from "../../../Utlis/Common/commonValidator";
import { ErrorMessage, SuccessMessage } from "../../../Utlis/Toastify/ToastMessage";
import OpeningDetails from "../../studentOpenings/openingDetails";
import OperationsList from "../shared/OperationsList";
import IndiaStateCitySelect from "../../custom/indiaStateCitySelect";

const initialForm = {
  company: "",
  title: "",
  description: "",
  location: "",
  skills: "",
  languages: "",
  experience: "",
  salaryMin: "",
  salaryMax: "",
  jobType: "Full-time",
  category: "IT",
  vacancies: 1,
  minCGPA: "",
  activeBacklogs: "",
  branches: "",
  passingYear: "",
  status: "Open",
  applicationDeadline: ""
};

const split = (value) => String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
const splitNumbers = (value) => split(value).map(Number).filter((item) => !Number.isNaN(item));
const join = (value) => Array.isArray(value) ? value.join(", ") : value || "";
const getOpeningForm = (opening) => ({
  company: opening?.companyId || opening?.company?._id || "",
  title: opening?.title || opening?.role || "",
  description: opening?.description || "",
  location: join(opening?.locations || opening?.location),
  skills: join(opening?.skillList || opening?.skills),
  languages: join(opening?.languageList || opening?.languages),
  experience: opening?.experience ?? "",
  salaryMin: opening?.salary?.min ?? opening?.salaryMin ?? "",
  salaryMax: opening?.salary?.max ?? opening?.salaryMax ?? "",
  jobType: opening?.jobType || "Full-time",
  category: opening?.category || "IT",
  vacancies: opening?.vacancies || 1,
  minCGPA: opening?.eligibility?.minCGPA ?? opening?.minCGPA ?? "",
  activeBacklogs: opening?.eligibility?.activeBacklogs ?? opening?.activeBacklogs ?? "",
  branches: join(opening?.eligibility?.branches || opening?.branches),
  passingYear: join(opening?.eligibility?.passingYear || opening?.passingYear),
  status: opening?.status || "Open",
  applicationDeadline: opening?.applicationDeadlineDate || opening?.applicationDeadline?.slice?.(0, 10) || ""
});
const jobExportColumns = [
  { key: "company", label: "Company" },
  { key: "companyId", label: "Company ID" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "location", label: "Location" },
  { key: "skills", label: "Skills" },
  { key: "languages", label: "Languages" },
  { key: "experience", label: "Experience" },
  { key: "salary.min", label: "Salary Min" },
  { key: "salary.max", label: "Salary Max" },
  { key: "jobType", label: "Job Type" },
  { key: "category", label: "Category" },
  { key: "vacancies", label: "Vacancies" },
  { key: "eligibility.minCGPA", label: "Eligibility Min CGPA" },
  { key: "eligibility.activeBacklogs", label: "Eligibility Active Backlogs" },
  { key: "eligibility.branches", label: "Eligibility Branches" },
  { key: "eligibility.passingYear", label: "Eligibility Passing Year" },
  { key: "status", label: "Status" },
  { key: "postedBy", label: "Posted By" },
  { key: "applicationDeadline", label: "Application Deadline" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
];

function OpeningFormModal({ open, opening, onClose, onSaved }) {
  const isEdit = Boolean(opening?.id);
  const [form, setForm] = useState(initialForm);
  const [companies, setCompanies] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(isEdit ? getOpeningForm(opening) : initialForm);
    setLoadingCompanies(true);
    handleGetCompanies({ isActive: true, limit: 100 })
      .then((items) => {
        const activeCompanies = (items || []).filter((item) => item.status !== "Inactive");
        setCompanies(isEdit && opening?.companyId && !activeCompanies.some((item) => item.id === opening.companyId)
          ? [{ id: opening.companyId, name: opening.company || "Current company" }, ...activeCompanies]
          : activeCompanies);
      })
      .finally(() => setLoadingCompanies(false));
  }, [isEdit, open, opening]);

  if (!open) return null;

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const requiredError = isRequired(form.company, "Company") || isRequired(form.title, "Title");
    if (requiredError) return requiredError;
    if (Number(form.vacancies) < 1) return "Vacancies must be at least 1";
    if (form.minCGPA !== "" && (Number(form.minCGPA) < 0 || Number(form.minCGPA) > 10)) return "Minimum CGPA must be between 0 and 10";
    if (form.activeBacklogs !== "" && Number(form.activeBacklogs) < 0) return "Active backlogs must be positive";
    if (form.salaryMin !== "" && Number(form.salaryMin) < 0) return "Minimum salary must be positive";
    if (form.salaryMax !== "" && Number(form.salaryMax) < 0) return "Maximum salary must be positive";
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      ErrorMessage(error);
      return;
    }

    const payload = {
      company: form.company,
      title: form.title,
      description: form.description,
      location: split(form.location),
      skills: split(form.skills),
      languages: split(form.languages),
      experience: Number(form.experience) || 0,
      salary: {
        min: Number(form.salaryMin) || 0,
        max: Number(form.salaryMax) || 0
      },
      jobType: form.jobType,
      category: form.category,
      vacancies: Number(form.vacancies) || 1,
      eligibility: {
        minCGPA: Number(form.minCGPA) || 0,
        activeBacklogs: form.activeBacklogs === "" ? undefined : Number(form.activeBacklogs),
        branches: split(form.branches),
        passingYear: splitNumbers(form.passingYear)
      },
      status: form.status,
      applicationDeadline: form.applicationDeadline || undefined
    };

    setSaving(true);
    try {
      const saved = isEdit ? await handleUpdateOpening({ ...payload, id: opening.id }) : await handleCreateOpening(payload);
      if (!saved) {
        ErrorMessage(isEdit ? "Opening update failed" : "Opening creation failed");
        return;
      }
      SuccessMessage(isEdit ? "Opening updated" : "Opening created");
      setForm(initialForm);
      await onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={submit} className="modal-shell flex max-h-[88vh] max-w-5xl flex-col">
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Operations</span>
            <h2 className="modal-title">{isEdit ? "Edit Opening" : "Create Opening"}</h2>
            <p className="modal-subtitle">{isEdit ? "Update this job opening using the operations jobs API." : "Create a job opening using the documented operations jobs API."}</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body min-h-0 flex-1 overflow-y-auto pb-6">
          <section className="modal-section">
            <h3 className="modal-section-title">Opening Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="form-label">Company</span>
                <select className="form-input" value={form.company} onChange={(event) => update("company", event.target.value)} disabled={loadingCompanies}>
                  <option value="">{loadingCompanies ? "Loading companies..." : "Select company"}</option>
                  {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                </select>
              </label>
              <label>
                <span className="form-label">Title</span>
                <input className="form-input" value={form.title} onChange={(event) => update("title", event.target.value)} />
              </label>
              <label className="md:col-span-2">
                <span className="form-label">Description</span>
                <textarea className="form-input min-h-28 rounded-lg" value={form.description} onChange={(event) => update("description", event.target.value)} />
              </label>
              <label className="md:col-span-2">
                <span className="form-label">Locations</span>
                <IndiaStateCitySelect value={form.location} onChange={(value) => update("location", value)} />
              </label>
              <label>
                <span className="form-label">Skills</span>
                <input className="form-input" placeholder="JavaScript, Node.js" value={form.skills} onChange={(event) => update("skills", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Languages</span>
                <input className="form-input" placeholder="English, Hindi, Marathi" value={form.languages} onChange={(event) => update("languages", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Experience</span>
                <input className="form-input" type="number" min="0" value={form.experience} onChange={(event) => update("experience", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Vacancies</span>
                <input className="form-input" type="number" min="1" value={form.vacancies} onChange={(event) => update("vacancies", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Salary min</span>
                <input className="form-input" type="number" min="0" value={form.salaryMin} onChange={(event) => update("salaryMin", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Salary max</span>
                <input className="form-input" type="number" min="0" value={form.salaryMax} onChange={(event) => update("salaryMax", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Job type</span>
                <select className="form-input" value={form.jobType} onChange={(event) => update("jobType", event.target.value)}>
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </label>
              <label>
                <span className="form-label">Category</span>
                <select className="form-input" value={form.category} onChange={(event) => update("category", event.target.value)}>
                  <option value="IT">IT</option>
                  <option value="Non-IT">Non-IT</option>
                </select>
              </label>
              <label>
                <span className="form-label">Status</span>
                <select className="form-input" value={form.status} onChange={(event) => update("status", event.target.value)}>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </label>
              <label>
                <span className="form-label">Application deadline</span>
                <input className="form-input" type="date" value={form.applicationDeadline} onChange={(event) => update("applicationDeadline", event.target.value)} />
              </label>
            </div>
          </section>

          <section className="modal-section mt-4">
            <h3 className="modal-section-title">Eligibility</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className="form-label">Minimum CGPA</span>
                <input className="form-input" type="number" min="0" max="10" step="0.1" value={form.minCGPA} onChange={(event) => update("minCGPA", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Active backlogs</span>
                <input className="form-input" type="number" min="0" value={form.activeBacklogs} onChange={(event) => update("activeBacklogs", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Branches</span>
                <input className="form-input" placeholder="Computer Science, IT" value={form.branches} onChange={(event) => update("branches", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Passing year</span>
                <input className="form-input" placeholder="2026, 2027" value={form.passingYear} onChange={(event) => update("passingYear", event.target.value)} />
              </label>
            </div>
          </section>

          <div className="mt-5 flex justify-end gap-2">
            <CustomButton type="button" variant="secondary" onClick={onClose}>Cancel</CustomButton>
            <CustomButton type="submit" loading={saving}>{isEdit ? "Update Opening" : "Create Opening"}</CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}

function OpenLinkModal({ opening, onClose, onSaved }) {
  const today = new Date().toISOString().slice(0, 10);
  const [expiresAt, setExpiresAt] = useState(opening?.openLinkExpiresAt || today);
  const [saving, setSaving] = useState(false);
  if (!opening) return null;
  const publicUrl = `${window.location.origin}/open-link/${opening.id}`;

  const save = async (active) => {
    setSaving(true);
    try {
      await (active ? handleUpdateOpeningOpenLink(opening.id, { isActive: true, expiresAt }) : handleCloseOpeningOpenLink(opening.id));
      SuccessMessage(active ? "Open link active" : "Open link closed");
      await onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    SuccessMessage("Open link copied");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-shell max-w-xl">
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Open Link</span>
            <h2 className="modal-title">{opening.role}</h2>
            <p className="modal-subtitle">Create a public application link for students without login.</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body grid gap-4">
          <label>
            <span className="form-label">Expiry date</span>
            <input className="form-input" type="date" min={today} value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />
          </label>
          <div>
            <span className="form-label">Public link</span>
            <div className="flex gap-2">
              <input className="form-input" value={publicUrl} readOnly />
              <button className="secondary-btn flex items-center gap-2" type="button" onClick={copy}>
                <Copy className="h-4 w-4" /> Copy
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {opening.openLinkActive ? (
              <CustomButton type="button" variant="secondary" loading={saving} onClick={() => save(false)}>Close Link</CustomButton>
            ) : (
              <CustomButton type="button" loading={saving} onClick={() => save(true)}>Reopen Link</CustomButton>
            )}
            <CustomButton type="button" loading={saving} onClick={() => save(true)}>Save Expiry</CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobOpeningManagement() {
  const location = useLocation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingOpening, setEditingOpening] = useState(null);
  const [openLinkRow, setOpenLinkRow] = useState(null);
  const [refreshList, setRefreshList] = useState(null);
  const initialOpeningId = location.state?.openingId;

  return (
    <>
      <OperationsList
        title="Job Opening Management"
        searchPlaceholder="Search company, role, location, skills"
        fetchItems={handleGetOperationsOpenings}
        fetchFilterOptions={handleGetOperationsOpeningFilterOptions}
        searchKeys={["company", "role", "location", "skills", "languages", "category"]}
        columns={[{ key: "company", label: "Company" }, { key: "role", label: "Role" }, { key: "location", label: "Location" }, { key: "skills", label: "Skills" }, { key: "languages", label: "Languages" }, { key: "category", label: "Category" }, { key: "salary", label: "Salary" }, { key: "vacancies", label: "Vacancies" }, { key: "status", label: "Status" }]}
        filterConfig={[{ key: "company", label: "Company" }, { key: "location", label: "Location" }, { key: "category", label: "Category" }, { key: "status", label: "Status" }]}
        primaryAction={{ label: "Create Opening", onClick: async (_setItems, reload) => { setRefreshList(() => reload); setCreateOpen(true); } }}
        editAction={{ onClick: (row, _setItems, reload) => { setRefreshList(() => reload); setEditingOpening(row); } }}
        statusActions={[
          { label: "Open Link", onClick: (row, _setItems, reload) => { setRefreshList(() => reload); setOpenLinkRow(row); }, disabled: (row) => row.status === "Draft" },
          { label: "Close", message: (row) => `Close ${row.role}?`, run: (row) => handleSetOpeningStatus(row.id, "Closed"), update: (rows, row) => rows.map((item) => item.id === row.id ? { ...item, status: "Closed" } : item), success: "Opening closed", disabled: (row) => row.status === "Closed" },
          { label: "Reopen", message: (row) => `Reopen ${row.role}?`, run: (row) => handleSetOpeningStatus(row.id, "Open"), update: (rows, row) => rows.map((item) => item.id === row.id ? { ...item, status: "Open" } : item), success: "Opening reopened", disabled: (row) => row.status === "Open" },
          { label: "Duplicate", message: (row) => `Duplicate ${row.role}?`, run: handleDuplicateOpening, update: (rows, row) => [{ ...row, id: `job-${Date.now()}`, role: `${row.role} Copy`, status: "Open" }, ...rows], success: "Opening duplicated" }
        ]}
        deleteAction={{ run: (row) => handleDeleteOpening(row.id) }}
        exportAction={handleExportApplicants}
        exportColumns={jobExportColumns}
        hiddenListKeys={["salary", "vacancies"]}
        initialSelectedId={initialOpeningId}
        detailContent={(row) => <OpeningDetails opening={row} />}
        rowDetail={(row) => row ? Object.entries(row).map(([key, value]) => <p key={key}><b>{key}:</b> {String(value)}</p>) : null}
      />
      <OpeningFormModal open={createOpen} onClose={() => setCreateOpen(false)} onSaved={refreshList || (() => Promise.resolve())} />
      <OpeningFormModal open={Boolean(editingOpening)} opening={editingOpening} onClose={() => setEditingOpening(null)} onSaved={refreshList || (() => Promise.resolve())} />
      <OpenLinkModal open={Boolean(openLinkRow)} opening={openLinkRow} onClose={() => setOpenLinkRow(null)} onSaved={refreshList || (() => Promise.resolve())} />
    </>
  );
}
