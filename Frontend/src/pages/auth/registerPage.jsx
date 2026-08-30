import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Phone, Sparkles, UserRound, UserRoundPlus } from "lucide-react";
import CustomButton from "../../components/custom/customButton";
import { handleRegister } from "../../Services/apiCalling/authApis";
import { isEmail, isMobile, isRequired } from "../../Utlis/Common/commonValidator";
import { ErrorMessage, SuccessMessage } from "../../Utlis/Toastify/ToastMessage";

const registerHighlights = ["Guided Profile", "One-Click Apply", "Interview Tracker"];

const fieldShell = "flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 shadow-sm transition focus-within:border-[#F43F5E]/70 focus-within:shadow-[0_0_0_5px_rgba(244,63,94,0.10)] hover:border-[#F43F5E]/40";
const fieldInput = "min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0A0A0A] outline-none placeholder:text-black/35";

function TextField({ label, icon: Icon, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#0A0A0A]">{label}</span>
      <span className={fieldShell}>
        <Icon size={19} className="shrink-0 text-black/38" />
        <input className={fieldInput} {...props} />
      </span>
    </label>
  );
}

// The reveal toggle stays on screen whether or not anything has been typed, so
// the control never appears or disappears mid-entry.
function PasswordField({ label, visible, onToggleVisible, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#0A0A0A]">{label}</span>
      <span className={fieldShell}>
        <LockKeyhole size={19} className="shrink-0 text-black/38" />
        <input className={fieldInput} type={visible ? "text" : "password"} {...props} />
        <button
          type="button"
          onClick={onToggleVisible}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          title={visible ? "Hide password" : "Show password"}
          className="grid shrink-0 place-items-center rounded-lg p-1 text-black/38 transition hover:text-[#F43F5E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F5E]/50"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </span>
    </label>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const setField = (field) => (event) => update(field, event.target.value);

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
      SuccessMessage("Verification OTP sent to your email.");
      navigate("/verify-otp", {
        replace: true,
        state: {
          email: response.email || form.email,
          expiresAt: response.expiresAt,
          syncedApplications: response.syncedApplications || 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#0A0A0A]">
      <style>{`
        @keyframes registerFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -12px, 0); }
        }

        @keyframes registerFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .register-shell {
          background:
            radial-gradient(circle at 14% 82%, rgba(244, 63, 94, 0.14), transparent 28%),
            radial-gradient(circle at 88% 16%, rgba(34, 197, 94, 0.13), transparent 26%),
            linear-gradient(115deg, rgba(236, 254, 255, 0.92), rgba(255, 255, 255, 0.9) 45%, rgba(255, 247, 237, 0.82));
        }

        .register-grid {
          background-image:
            linear-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.06) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: linear-gradient(to bottom, black, transparent 82%);
        }

        .register-fade-up {
          animation: registerFadeUp 0.72s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .register-float {
          animation: registerFloat 5.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .register-fade-up,
          .register-float {
            animation: none;
          }
        }
      `}</style>

      <section className="register-shell relative grid min-h-screen place-items-center px-4 py-6 sm:px-6">
        <div className="register-grid pointer-events-none absolute inset-0" />

        <header className="absolute left-0 right-0 top-0 z-10">
          <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-5 sm:px-6">
            <Link to="/" className="text-2xl font-semibold tracking-normal text-[#0A0A0A]" aria-label="Magnus Copo home">
              Magnus <span className="text-[#F43F5E]">Copo</span>
            </Link>
            <Link to="/" className="inline-flex min-h-10 items-center rounded-full border border-[#0A0A0A] bg-white px-5 text-sm font-semibold text-[#0A0A0A] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F2F2F2]">
              Back
            </Link>
          </div>
        </header>

        <div className="relative z-10 grid w-full max-w-6xl items-center gap-8 pt-20 lg:grid-cols-[1fr_1fr]">
          <section className="register-fade-up hidden lg:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white/80 px-4 py-2 text-sm font-semibold text-[#2B0A2E] shadow-sm backdrop-blur">
              <Sparkles size={16} className="text-[#F43F5E]" />
              Start your placement journey
            </span>
            <h1 className="mt-7 max-w-xl text-5xl font-black leading-[1.02] tracking-normal text-[#0A0A0A]">
              Build your placement profile in minutes.
            </h1>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-black/60">
              One student account keeps your applications, interviews and offers together from the first click.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {registerHighlights.map((item, index) => (
                <span
                  key={item}
                  className="register-float rounded-full border border-[#E5E5E5] bg-white/85 px-4 py-2 text-sm font-semibold text-black/70 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-1 hover:border-[#F43F5E]/50 hover:text-[#2B0A2E]"
                  style={{ animationDelay: `${index * 260}ms` }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 overflow-hidden rounded-[24px] border border-white/70 bg-white/75 shadow-[0_28px_70px_rgba(15,23,42,0.13)] backdrop-blur-xl">
              <div className="p-5">
                <p className="text-2xl font-black text-[#F43F5E]">Free</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-black/55">To join</p>
              </div>
              <div className="border-x border-slate-200/80 p-5">
                <p className="text-2xl font-black text-[#0A0A0A]">5m</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-black/55">Quick setup</p>
              </div>
              <div className="p-5">
                <p className="text-2xl font-black text-[#2B0A2E]">1</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-black/55">Profile</p>
              </div>
            </div>
          </section>

          <form onSubmit={submit} className="register-fade-up relative mx-auto w-full max-w-lg overflow-hidden rounded-[28px] border border-white/75 bg-white/85 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8" style={{ animationDelay: "120ms" }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#06b6d4,#22c55e,#F43F5E)]" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#F43F5E]">Get started</p>
                <h1 className="mt-2 text-3xl font-black tracking-normal text-[#0A0A0A]">Create account</h1>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E]">
                <UserRoundPlus size={24} strokeWidth={1.8} />
              </div>
            </div>

            <p className="mt-3 text-sm font-medium leading-6 text-black/58">
              Register as a student and start building your placement profile.
            </p>

            <div className="mt-7 space-y-4">
              <TextField
                label="Full name"
                icon={UserRound}
                autoComplete="name"
                placeholder="Your full name"
                value={form.name}
                onChange={setField("name")}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Email"
                  icon={Mail}
                  type="email"
                  autoComplete="email"
                  placeholder="you@campus.com"
                  value={form.email}
                  onChange={setField("email")}
                />
                <TextField
                  label="Mobile"
                  icon={Phone}
                  type="tel"
                  autoComplete="tel"
                  placeholder="Optional"
                  value={form.mobile}
                  onChange={setField("mobile")}
                />
              </div>

              <PasswordField
                label="Password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={setField("password")}
                visible={showPassword}
                onToggleVisible={() => setShowPassword((previous) => !previous)}
              />

              <PasswordField
                label="Confirm password"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={setField("confirmPassword")}
                visible={showConfirmPassword}
                onToggleVisible={() => setShowConfirmPassword((previous) => !previous)}
              />

              <CustomButton loading={loading} className="min-h-12 w-full rounded-full bg-[#0A0A0A] text-white shadow-[0_18px_34px_rgba(10,10,10,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2B0A2E] hover:shadow-[0_24px_48px_rgba(43,10,46,0.22)]">
                <span>{loading ? "Creating account" : "Register"}</span>
                {!loading ? <ArrowRight size={17} /> : null}
              </CustomButton>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-center text-sm font-semibold sm:flex-row sm:items-center sm:justify-between">
              <Link className="text-[#F43F5E] transition hover:text-[#2B0A2E]" to="/login">Already have an account? Login</Link>
              <Link className="text-black/45 transition hover:text-[#0A0A0A]" to="/">Back to entry</Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
