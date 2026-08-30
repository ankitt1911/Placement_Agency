import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, MailCheck, RefreshCcw, ShieldCheck } from "lucide-react";
import CustomButton from "../../components/custom/customButton";
import { handleResendSignupOtp, handleVerifySignupOtp } from "../../Services/apiCalling/authApis";
import { ErrorMessage, SuccessMessage } from "../../Utlis/Toastify/ToastMessage";

const fieldShell = "flex items-center justify-center gap-2 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 shadow-sm transition focus-within:border-[#F43F5E]/70 focus-within:shadow-[0_0_0_5px_rgba(244,63,94,0.10)] hover:border-[#F43F5E]/40";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pendingEmail = location.state?.email || sessionStorage.getItem("pendingSignupEmail") || "";
  const initialExpiry = location.state?.expiresAt || sessionStorage.getItem("pendingSignupOtpExpiresAt") || "";
  const [email] = useState(pendingEmail);
  const [otp, setOtp] = useState("");
  const [expiresAt, setExpiresAt] = useState(initialExpiry);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const expired = secondsLeft <= 0;
  const maskedEmail = useMemo(() => email || "your email", [email]);

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
      return;
    }
    sessionStorage.setItem("pendingSignupEmail", email);
    if (expiresAt) sessionStorage.setItem("pendingSignupOtpExpiresAt", expiresAt);
  }, [email, expiresAt, navigate]);

  useEffect(() => {
    const tick = () => {
      const expiryTime = expiresAt ? new Date(expiresAt).getTime() : 0;
      setSecondsLeft(Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000)));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const updateOtp = (event) => {
    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const verify = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) {
      ErrorMessage("Enter the 6 digit OTP");
      return;
    }
    if (expired) {
      ErrorMessage("OTP has expired. Please generate a new OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await handleVerifySignupOtp({ email, otp });
      if (!response) return;
      sessionStorage.removeItem("pendingSignupEmail");
      sessionStorage.removeItem("pendingSignupOtpExpiresAt");
      SuccessMessage(response.syncedApplications
        ? `Email verified. We synced ${response.syncedApplications} application(s). Please login.`
        : "Email verified successfully. Please login.");
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      const response = await handleResendSignupOtp({ email });
      if (!response) return;
      setOtp("");
      setExpiresAt(response.expiresAt);
      SuccessMessage("New OTP sent to your email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#0A0A0A]">
      <section className="relative grid min-h-screen place-items-center bg-[linear-gradient(115deg,rgba(236,254,255,0.92),rgba(255,255,255,0.9)_45%,rgba(255,247,237,0.82))] px-4 py-6 sm:px-6">
        <header className="absolute left-0 right-0 top-0 z-10">
          <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-5 sm:px-6">
            <Link to="/" className="text-2xl font-semibold tracking-normal text-[#0A0A0A]" aria-label="Magnus Copo home">
              Magnus <span className="text-[#F43F5E]">Copo</span>
            </Link>
            <Link to="/register" className="inline-flex min-h-10 items-center rounded-full border border-[#0A0A0A] bg-white px-5 text-sm font-semibold text-[#0A0A0A] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F2F2F2]">
              Back
            </Link>
          </div>
        </header>

        <form onSubmit={verify} className="relative z-10 mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-white/75 bg-white/90 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#06b6d4,#22c55e,#F43F5E)]" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#F43F5E]">Email verification</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-[#0A0A0A]">Enter OTP</h1>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E]">
              <MailCheck size={24} strokeWidth={1.8} />
            </div>
          </div>

          <p className="mt-3 text-sm font-medium leading-6 text-black/58">
            We sent a 6 digit verification code to <span className="font-bold text-[#0A0A0A]">{maskedEmail}</span>.
          </p>

          <label className="mt-7 block">
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

          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3">
            <span className="text-sm font-semibold text-black/58">{expired ? "OTP expired" : "OTP expires in"}</span>
            <span className={`text-lg font-black ${expired ? "text-[#F43F5E]" : "text-[#0A0A0A]"}`}>{formatTime(secondsLeft)}</span>
          </div>

          <div className="mt-6 space-y-3">
            <CustomButton loading={loading} disabled={expired} className="min-h-12 w-full rounded-full bg-[#0A0A0A] text-white shadow-[0_18px_34px_rgba(10,10,10,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2B0A2E]">
              <span>{loading ? "Verifying" : "Verify OTP"}</span>
              {!loading ? <ArrowRight size={17} /> : null}
            </CustomButton>

            <button
              type="button"
              onClick={resend}
              disabled={resending}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-5 text-sm font-bold text-[#0A0A0A] shadow-sm transition hover:-translate-y-0.5 hover:border-[#F43F5E]/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw size={16} className={resending ? "animate-spin" : ""} />
              {resending ? "Sending new OTP" : "Generate new OTP"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm font-semibold">
            <Link className="text-[#F43F5E] transition hover:text-[#2B0A2E]" to="/login">Already verified? Login</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
