import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import CustomButton from "../../components/custom/customButton";
import { login } from "../../ReduxFeature/Authenthicate/LoginSlice";
import { handleLogin } from "../../Services/apiCalling/authApis";
import { ErrorMessage, SuccessMessage } from "../../Utlis/Toastify/ToastMessage";

const loginHighlights = ["Student Portal", "Operations Dashboard", "Placement Analytics"];

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      ErrorMessage("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const response = await handleLogin(form);
      if (!response) {
        ErrorMessage("Invalid login details");
        return;
      }
      dispatch(login(response));
      SuccessMessage("Logged in successfully");
      navigate(response.user.role === "operations" ? "/operations/dashboard" : "/student/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#0A0A0A]">
      <style>{`
        @keyframes loginFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -12px, 0); }
        }

        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-shell {
          background:
            radial-gradient(circle at 12% 18%, rgba(244, 63, 94, 0.14), transparent 28%),
            radial-gradient(circle at 86% 12%, rgba(34, 197, 94, 0.13), transparent 26%),
            linear-gradient(115deg, rgba(236, 254, 255, 0.92), rgba(255, 255, 255, 0.9) 45%, rgba(255, 247, 237, 0.82));
        }

        .login-grid {
          background-image:
            linear-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.06) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: linear-gradient(to bottom, black, transparent 82%);
        }

        .login-fade-up {
          animation: loginFadeUp 0.72s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .login-float {
          animation: loginFloat 5.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .login-fade-up,
          .login-float {
            animation: none;
          }
        }
      `}</style>

      <section className="login-shell relative grid min-h-screen place-items-center px-4 py-6 sm:px-6">
        <div className="login-grid pointer-events-none absolute inset-0" />

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

        <div className="relative z-10 grid w-full max-w-6xl items-center gap-8 pt-20 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="login-fade-up hidden lg:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white/80 px-4 py-2 text-sm font-semibold text-[#2B0A2E] shadow-sm backdrop-blur">
              <Sparkles size={16} className="text-[#F43F5E]" />
              Unified access for campus teams
            </span>
            <h1 className="mt-7 max-w-xl text-5xl font-black leading-[1.02] tracking-normal text-[#0A0A0A]">
              Continue your placement workflow.
            </h1>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-black/60">
              One secure sign in opens the right dashboard automatically from your registered account role.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {loginHighlights.map((item, index) => (
                <span
                  key={item}
                  className="login-float rounded-full border border-[#E5E5E5] bg-white/85 px-4 py-2 text-sm font-semibold text-black/70 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-1 hover:border-[#F43F5E]/50 hover:text-[#2B0A2E]"
                  style={{ animationDelay: `${index * 260}ms` }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 overflow-hidden rounded-[24px] border border-white/70 bg-white/75 shadow-[0_28px_70px_rgba(15,23,42,0.13)] backdrop-blur-xl">
              <div className="p-5">
                <p className="text-2xl font-black text-[#F43F5E]">AI</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-black/55">Smart insights</p>
              </div>
              <div className="border-x border-slate-200/80 p-5">
                <p className="text-2xl font-black text-[#0A0A0A]">360</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-black/55">Student view</p>
              </div>
              <div className="p-5">
                <p className="text-2xl font-black text-[#2B0A2E]">1</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-black/55">Platform</p>
              </div>
            </div>
          </section>

          <form onSubmit={submit} className="login-fade-up relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-white/75 bg-white/85 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8" style={{ animationDelay: "120ms" }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#06b6d4,#22c55e,#F43F5E)]" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#F43F5E]">Welcome back</p>
                <h1 className="mt-2 text-3xl font-black tracking-normal text-[#0A0A0A]">Login</h1>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E]">
                <ShieldCheck size={24} strokeWidth={1.8} />
              </div>
            </div>

            <p className="mt-3 text-sm font-medium leading-6 text-black/58">
              Use your registered email and password. Your dashboard is selected from your account role.
            </p>

            <div className="mt-7 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#0A0A0A]">Email</span>
                <span className="flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 shadow-sm transition focus-within:border-[#F43F5E]/70 focus-within:shadow-[0_0_0_5px_rgba(244,63,94,0.10)] hover:border-[#F43F5E]/40">
                  <Mail size={19} className="shrink-0 text-black/38" />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0A0A0A] outline-none placeholder:text-black/35"
                    type="email"
                    autoComplete="email"
                    placeholder="you@campus.com"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#0A0A0A]">Password</span>
                <span className="flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 shadow-sm transition focus-within:border-[#F43F5E]/70 focus-within:shadow-[0_0_0_5px_rgba(244,63,94,0.10)] hover:border-[#F43F5E]/40">
                  <LockKeyhole size={19} className="shrink-0 text-black/38" />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0A0A0A] outline-none placeholder:text-black/35"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                  />
                </span>
              </label>

              <CustomButton loading={loading} className="min-h-12 w-full rounded-full bg-[#0A0A0A] text-white shadow-[0_18px_34px_rgba(10,10,10,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2B0A2E] hover:shadow-[0_24px_48px_rgba(43,10,46,0.22)]">
                <span>{loading ? "Signing in" : "Login"}</span>
                {!loading ? <ArrowRight size={17} /> : null}
              </CustomButton>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-center text-sm font-semibold sm:flex-row sm:items-center sm:justify-between">
              <Link className="text-[#F43F5E] transition hover:text-[#2B0A2E]" to="/register">Create student account</Link>
              <Link className="text-black/45 transition hover:text-[#0A0A0A]" to="/">Back to entry</Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
