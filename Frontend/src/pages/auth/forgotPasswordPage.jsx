import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, RefreshCcw, ShieldCheck } from "lucide-react";
import CustomButton from "../../components/custom/customButton";
import { handleForgotPassword, handleResetPassword, handleVerifyForgotPasswordOtp } from "../../Services/apiCalling/authApis";
import { isEmail, isRequired } from "../../Utlis/Common/commonValidator";
import { ErrorMessage, SuccessMessage } from "../../Utlis/Toastify/ToastMessage";

const fieldShell = "flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 shadow-sm transition focus-within:border-[#F43F5E]/70 focus-within:shadow-[0_0_0_5px_rgba(244,63,94,0.10)] hover:border-[#F43F5E]/40";
const fieldInput = "min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0A0A0A] outline-none placeholder:text-black/35";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

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

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const expired = step !== "email" && secondsLeft <= 0;

  useEffect(() => {
    const tick = () => {
      const expiryTime = expiresAt ? new Date(expiresAt).getTime() : 0;
      setSecondsLeft(Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000)));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const sendOtp = async (event) => {
    event?.preventDefault();
    const error = isRequired(email, "Email") || isEmail(email);
    if (error) {
      ErrorMessage(error);
      return;
    }
    setLoading(true);
    try {
      const response = await handleForgotPassword({ email });
      if (!response) return;
      setOtp("");
      setExpiresAt(response.expiresAt);
      setStep("otp");
      SuccessMessage("Password reset OTP sent to your email.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) {
      ErrorMessage("Enter the 6 digit OTP");
      return;
    }
    if (expired) {
      ErrorMessage("OTP has expired. Please send a new OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await handleVerifyForgotPasswordOtp({ email, otp });
      if (!response) return;
      setStep("password");
      SuccessMessage("OTP verified successfully.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (expired) {
      ErrorMessage("OTP has expired. Please send a new OTP");
      setStep("otp");
      return;
    }
    if (passwords.newPassword.length < 6) {
      ErrorMessage("Password must be at least 6 characters");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      ErrorMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await handleResetPassword({ email, ...passwords });
      if (!response) return;
      SuccessMessage("Password reset successfully. Please login.");
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const updateOtp = (event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#0A0A0A]">
      <section className="relative grid min-h-screen place-items-center bg-[linear-gradient(115deg,rgba(236,254,255,0.92),rgba(255,255,255,0.9)_45%,rgba(255,247,237,0.82))] px-4 py-6 sm:px-6">
        <header className="absolute left-0 right-0 top-0 z-10">
          <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-5 sm:px-6">
            <Link to="/" className="text-2xl font-semibold tracking-normal text-[#0A0A0A]" aria-label="Magnus Copo home">
              Magnus <span className="text-[#F43F5E]">Copo</span>
            </Link>
            <Link to="/login" className="inline-flex min-h-10 items-center rounded-full border border-[#0A0A0A] bg-white px-5 text-sm font-semibold text-[#0A0A0A] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F2F2F2]">
              Login
            </Link>
          </div>
        </header>

        <form onSubmit={step === "email" ? sendOtp : step === "otp" ? verifyOtp : resetPassword} className="relative z-10 mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-white/75 bg-white/90 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#06b6d4,#22c55e,#F43F5E)]" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#F43F5E]">Password help</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-[#0A0A0A]">
                {step === "email" ? "Forgot password" : step === "otp" ? "Verify OTP" : "New password"}
              </h1>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E]">
              <ShieldCheck size={24} strokeWidth={1.8} />
            </div>
          </div>

          <p className="mt-3 text-sm font-medium leading-6 text-black/58">
            {step === "email" ? "Enter your registered email to receive a reset OTP." : `Reset code sent to ${email}.`}
          </p>

          <div className="mt-7 space-y-4">
            {step === "email" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#0A0A0A]">Email</span>
                <span className={fieldShell}>
                  <Mail size={19} className="shrink-0 text-black/38" />
                  <input className={fieldInput} type="email" autoComplete="email" placeholder="you@campus.com" value={email} onChange={(event) => setEmail(event.target.value)} />
                </span>
              </label>
            ) : null}

            {step === "otp" ? (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#0A0A0A]">Verification code</span>
                  <span className={fieldShell}>
                    <ShieldCheck size={19} className="shrink-0 text-black/38" />
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      className="min-w-0 flex-1 bg-transparent text-center text-2xl font-black tracking-[0.45em] text-[#0A0A0A] outline-none placeholder:tracking-normal placeholder:text-sm placeholder:font-semibold placeholder:text-black/35"
                      placeholder="000000"
                      value={otp}
                      onChange={updateOtp}
                    />
                  </span>
                </label>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3">
                  <span className="text-sm font-semibold text-black/58">{expired ? "OTP expired" : "OTP expires in"}</span>
                  <span className={`text-lg font-black ${expired ? "text-[#F43F5E]" : "text-[#0A0A0A]"}`}>{formatTime(secondsLeft)}</span>
                </div>
              </>
            ) : null}

            {step === "password" ? (
              <>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3">
                  <span className="text-sm font-semibold text-black/58">{expired ? "OTP expired" : "Reset window"}</span>
                  <span className={`text-lg font-black ${expired ? "text-[#F43F5E]" : "text-[#0A0A0A]"}`}>{formatTime(secondsLeft)}</span>
                </div>
                <PasswordField
                  label="New password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={passwords.newPassword}
                  onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })}
                  visible={showPassword}
                  onToggleVisible={() => setShowPassword((previous) => !previous)}
                />
                <PasswordField
                  label="Confirm new password"
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={passwords.confirmPassword}
                  onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })}
                  visible={showConfirmPassword}
                  onToggleVisible={() => setShowConfirmPassword((previous) => !previous)}
                />
              </>
            ) : null}

            <CustomButton loading={loading} disabled={step !== "email" && expired} className="min-h-12 w-full rounded-full bg-[#0A0A0A] text-white shadow-[0_18px_34px_rgba(10,10,10,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2B0A2E]">
              <span>{loading ? "Please wait" : step === "email" ? "Send OTP" : step === "otp" ? "Verify OTP" : "Change password"}</span>
              {!loading ? <ArrowRight size={17} /> : null}
            </CustomButton>

            {step !== "email" ? (
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-5 text-sm font-bold text-[#0A0A0A] shadow-sm transition hover:-translate-y-0.5 hover:border-[#F43F5E]/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                Generate new OTP
              </button>
            ) : null}
          </div>

          <div className="mt-6 text-center text-sm font-semibold">
            <Link className="text-[#F43F5E] transition hover:text-[#2B0A2E]" to="/login">Back to login</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
