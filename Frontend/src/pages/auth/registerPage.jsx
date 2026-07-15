import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../../components/custom/customButton";
import { handleRegister } from "../../Services/apiCalling/authApis";
import { isEmail, isMobile, isRequired } from "../../Utlis/Common/commonValidator";
import { ErrorMessage, SuccessMessage } from "../../Utlis/Toastify/ToastMessage";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const requiredError = isRequired(form.name, "Name") || isRequired(form.email, "Email") || isRequired(form.password, "Password");
    if (requiredError) return requiredError;
    if (isEmail(form.email)) return isEmail(form.email);
    if (form.mobile && isMobile(form.mobile)) return isMobile(form.mobile);
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      ErrorMessage(error);
      return;
    }
    setLoading(true);
    try {
      const response = await handleRegister(form);
      if (!response) {
        ErrorMessage("Registration failed");
        return;
      }
      SuccessMessage("Registration successful. Please login.");
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#eef7ff,#f8fafc)] px-4 py-8">
      <form onSubmit={submit} className="app-card w-full max-w-md p-6">
        <p className="text-2xl font-bold text-brand-700">Placement Hub</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-950">Create student account</h1>
        <p className="mt-1 text-sm text-slate-500">Register as a student and start building your placement profile.</p>
        <div className="mt-5 space-y-4">
          <label>
            <span className="form-label">Full name</span>
            <input className="form-input" value={form.name} onChange={(event) => update("name", event.target.value)} />
          </label>
          <label>
            <span className="form-label">Email</span>
            <input className="form-input" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
          </label>
          <label>
            <span className="form-label">Mobile</span>
            <input className="form-input" value={form.mobile} onChange={(event) => update("mobile", event.target.value)} />
          </label>
          <label>
            <span className="form-label">Password</span>
            <input className="form-input" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} />
          </label>
          <label>
            <span className="form-label">Confirm password</span>
            <input className="form-input" type="password" value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} />
          </label>
          <CustomButton className="w-full" loading={loading}>Register</CustomButton>
        </div>
        <Link className="mt-4 block text-center text-sm font-medium text-brand-700" to="/login">Already have an account? Login</Link>
        <Link className="mt-2 block text-center text-sm font-medium text-slate-500" to="/">Back to entry</Link>
      </form>
    </main>
  );
}
