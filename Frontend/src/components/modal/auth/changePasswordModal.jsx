import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";
import CustomButton from "../../custom/customButton";
import { handleChangePassword } from "../../../Services/apiCalling/authApis";
import { SuccessMessage } from "../../../Utlis/Toastify/ToastMessage";

const emptyForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

const fields = [
  { name: "currentPassword", label: "Current Password", placeholder: "Enter your current password" },
  { name: "newPassword", label: "New Password", placeholder: "Minimum 6 characters" },
  { name: "confirmPassword", label: "Confirm New Password", placeholder: "Re-enter the new password" }
];

const validate = (form) => {
  const errors = {};
  if (!form.currentPassword) errors.currentPassword = "Current password is required";
  if (!form.newPassword) errors.newPassword = "New password is required";
  else if (form.newPassword.length < 6) errors.newPassword = "New password must be at least 6 characters";
  else if (form.newPassword === form.currentPassword) errors.newPassword = "New password must be different from the current password";
  if (!form.confirmPassword) errors.confirmPassword = "Please confirm the new password";
  else if (form.confirmPassword !== form.newPassword) errors.confirmPassword = "Passwords do not match";
  return errors;
};

export default function ChangePasswordModal({ open, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setErrors({});
      setVisible({});
    }
  }, [open]);

  if (!open) return null;

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setSaving(true);
    const result = await handleChangePassword(form);
    setSaving(false);
    if (!result.success) return;

    SuccessMessage(result.message);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-shell max-w-md" onSubmit={submit}>
        <div className="modal-header">
          <div className="flex min-w-0 items-start gap-3">
            <span className="modal-header-icon">
              <KeyRound className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <span className="modal-eyebrow">Account Security</span>
              <h2 className="modal-title">Update Password</h2>
              <p className="modal-subtitle">Confirm your current password, then set a new one.</p>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body">
          <div className="grid gap-4">
            {fields.map((field) => (
              <label key={field.name}>
                <span className="form-label">{field.label}<span className="ml-1 text-red-600">*</span></span>
                <div className="relative">
                  <input
                    className="form-input pr-11"
                    type={visible[field.name] ? "text" : "password"}
                    placeholder={field.placeholder}
                    autoComplete={field.name === "currentPassword" ? "current-password" : "new-password"}
                    value={form[field.name]}
                    onChange={(event) => update(field.name, event.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-portal-muted transition hover:text-brand-700"
                    onClick={() => setVisible((current) => ({ ...current, [field.name]: !current[field.name] }))}
                    aria-label={visible[field.name] ? `Hide ${field.label}` : `Show ${field.label}`}
                  >
                    {visible[field.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors[field.name] ? <span className="mt-1 block text-xs text-red-600">{errors[field.name]}</span> : null}
              </label>
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <CustomButton type="button" variant="secondary" onClick={onClose}>Cancel</CustomButton>
            <CustomButton type="submit" loading={saving}>Update Password</CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}
