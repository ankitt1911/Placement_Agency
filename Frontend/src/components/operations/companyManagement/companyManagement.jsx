import { useEffect, useState } from "react";
import { X } from "lucide-react";
import CustomButton from "../../custom/customButton";
import { handleAddCompany, handleDeleteCompany, handleEditCompany, handleExportCompaniesExcel, handleGetCompanies, handleGetCompanyFilterOptions, handleSetCompanyStatus } from "../../../Services/apiCalling/companyApis";
import { isEmail, isRequired, isUrl } from "../../../Utlis/Common/commonValidator";
import { ErrorMessage, SuccessMessage } from "../../../Utlis/Toastify/ToastMessage";
import CompanyDetails from "./companyDetails";
import OperationsList from "../shared/OperationsList";

const initialForm = {
  name: "",
  industry: "",
  address: "",
  locations: "",
  website: "",
  logo: "",
  description: "",
  documents: "",
  contactName: "",
  contactEmail: "",
  contactPhone: ""
};

const split = (value) => String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
const join = (value) => Array.isArray(value) ? value.join(", ") : value || "";
const isValidUrlOrUploadPath = (value) => !value || value.startsWith("/uploads/") || !isUrl(value);
const getCompanyForm = (company) => ({
  name: company?.name || "",
  industry: company?.industry || "",
  address: company?.address || "",
  locations: join(company?.locations),
  website: company?.website || "",
  logo: company?.logo || "",
  description: company?.description || "",
  documents: join(company?.documents),
  contactName: company?.contactPerson?.name || "",
  contactEmail: company?.contactPerson?.email || "",
  contactPhone: company?.contactPerson?.phone || ""
});
const companyExportColumns = [
  { key: "name", label: "Name" },
  { key: "industry", label: "Industry" },
  { key: "address", label: "Address" },
  { key: "locations", label: "Locations" },
  { key: "website", label: "Website" },
  { key: "logo", label: "Logo" },
  { key: "description", label: "Description" },
  { key: "documents", label: "Documents" },
  { key: "contactPerson.name", label: "Contact Person Name" },
  { key: "contactPerson.email", label: "Contact Person Email" },
  { key: "contactPerson.phone", label: "Contact Person Phone" },
  { key: "isActive", label: "Active" },
  { key: "createdBy", label: "Created By" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
];

function CompanyFormModal({ open, company, onClose, onSaved }) {
  const isEdit = Boolean(company?.id);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(isEdit ? getCompanyForm(company) : initialForm);
  }, [company, isEdit, open]);

  if (!open) return null;

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const requiredError = isRequired(form.name, "Company name");
    if (requiredError) return requiredError;
    if (form.website && !isValidUrlOrUploadPath(form.website)) return "Enter a valid website URL";
    if (form.logo && !isValidUrlOrUploadPath(form.logo)) return "Enter a valid logo URL or upload path";
    if (form.contactEmail && isEmail(form.contactEmail)) return isEmail(form.contactEmail);
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
      name: form.name,
      industry: form.industry,
      address: form.address,
      locations: split(form.locations),
      website: form.website,
      logo: form.logo,
      description: form.description,
      documents: split(form.documents),
      contactPerson: {
        name: form.contactName,
        email: form.contactEmail,
        phone: form.contactPhone
      }
    };

    setSaving(true);
    try {
      const saved = isEdit ? await handleEditCompany({ ...payload, id: company.id }) : await handleAddCompany(payload);
      if (!saved) {
        ErrorMessage(isEdit ? "Company update failed" : "Company creation failed");
        return;
      }
      SuccessMessage(isEdit ? "Company updated" : "Company created");
      setForm(initialForm);
      await onSaved(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={submit} className="modal-shell flex max-h-[88vh] max-w-4xl flex-col">
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Operations</span>
            <h2 className="modal-title">{isEdit ? "Edit Company" : "Add Company"}</h2>
            <p className="modal-subtitle">{isEdit ? "Update this company using the operations company API." : "Create a company using the documented operations company API."}</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body min-h-0 flex-1 overflow-y-auto pb-6">
          <section className="modal-section">
            <h3 className="modal-section-title">Company Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="form-label">Company name</span>
                <input className="form-input" value={form.name} onChange={(event) => update("name", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Industry</span>
                <input className="form-input" value={form.industry} onChange={(event) => update("industry", event.target.value)} />
              </label>
              <label className="md:col-span-2">
                <span className="form-label">Address</span>
                <textarea className="form-input min-h-24 rounded-lg" value={form.address} onChange={(event) => update("address", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Locations</span>
                <input className="form-input" placeholder="Pune, Remote" value={form.locations} onChange={(event) => update("locations", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Website</span>
                <input className="form-input" placeholder="https://company.example.com" value={form.website} onChange={(event) => update("website", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Logo URL</span>
                <input className="form-input" placeholder="/uploads/logo.png or https://..." value={form.logo} onChange={(event) => update("logo", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Documents</span>
                <input className="form-input" placeholder="/uploads/doc.pdf, /uploads/policy.pdf" value={form.documents} onChange={(event) => update("documents", event.target.value)} />
              </label>
              <label className="md:col-span-2">
                <span className="form-label">Description</span>
                <textarea className="form-input min-h-28 rounded-lg" value={form.description} onChange={(event) => update("description", event.target.value)} />
              </label>
            </div>
          </section>

          <section className="modal-section mt-4">
            <h3 className="modal-section-title">Contact Person</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className="form-label">Name</span>
                <input className="form-input" value={form.contactName} onChange={(event) => update("contactName", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Email</span>
                <input className="form-input" type="email" value={form.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} />
              </label>
              <label>
                <span className="form-label">Phone</span>
                <input className="form-input" value={form.contactPhone} onChange={(event) => update("contactPhone", event.target.value)} />
              </label>
            </div>
          </section>

          <div className="mt-5 flex justify-end gap-2">
            <CustomButton type="button" variant="secondary" onClick={onClose}>Cancel</CustomButton>
            <CustomButton type="submit" loading={saving}>{isEdit ? "Update Company" : "Create Company"}</CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CompanyManagement() {
  const [addOpen, setAddOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [refreshList, setRefreshList] = useState(null);

  return (
    <>
      <OperationsList
        title="Company Management"
        searchPlaceholder="Search company, industry, location"
        fetchItems={handleGetCompanies}
        fetchFilterOptions={handleGetCompanyFilterOptions}
        searchKeys={["name", "industry", "locations", "website"]}
        columns={[{ key: "logo", label: "Logo" }, { key: "name", label: "Company" }, { key: "industry", label: "Industry" }, { key: "locations", label: "Locations" }, { key: "website", label: "Website" }, { key: "status", label: "Status" }]}
        filterConfig={[{ key: "industry", label: "Industry" }, { key: "location", label: "Location" }, { key: "status", paramKey: "isActive", optionsKey: "status", label: "Status" }]}
        primaryAction={{ label: "Add Company", onClick: async (_setItems, reload) => { setRefreshList(() => reload); setAddOpen(true); } }}
        editAction={{ onClick: (row, _setItems, reload) => { setRefreshList(() => reload); setEditingCompany(row); } }}
        statusActions={[
          { label: "Activate", message: (row) => `Activate ${row.name}?`, run: (row) => handleSetCompanyStatus(row.id, "Active"), update: (rows, row) => rows.map((item) => item.id === row.id ? { ...item, status: "Active" } : item), success: "Company activated", disabled: (row) => row.status === "Active" },
          { label: "Deactivate", message: (row) => `Deactivate ${row.name}?`, run: (row) => handleSetCompanyStatus(row.id, "Inactive"), update: (rows, row) => rows.map((item) => item.id === row.id ? { ...item, status: "Inactive" } : item), success: "Company deactivated", disabled: (row) => row.status === "Inactive" }
        ]}
        deleteAction={{ run: (row) => handleDeleteCompany(row.id) }}
        exportAction={handleExportCompaniesExcel}
        exportColumns={companyExportColumns}
        showProgressBar={false}
        detailContent={(row) => <CompanyDetails company={row} />}
        rowDetail={(row) => row ? Object.entries(row).map(([key, value]) => <p key={key}><b>{key}:</b> {String(value)}</p>) : null}
      />
      <CompanyFormModal open={addOpen} onClose={() => setAddOpen(false)} onSaved={refreshList || (() => Promise.resolve())} />
      <CompanyFormModal open={Boolean(editingCompany)} company={editingCompany} onClose={() => setEditingCompany(null)} onSaved={refreshList || (() => Promise.resolve())} />
    </>
  );
}
