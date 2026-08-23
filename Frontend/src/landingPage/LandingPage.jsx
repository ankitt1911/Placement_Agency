import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Instagram,
  Linkedin,
  LogIn,
  Menu,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  UsersRound,
  X
} from "lucide-react";
import studentHero from "../assets/landing/student-hero.png";

const navLinks = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Opportunities", "#opportunities"],
  ["Training", "#training"],
  ["Placements", "#placements"],
  ["Contact", "#contact"]
];

const stats = [
  [Building2, "100+", "Colleges Associated"],
  [UsersRound, "1000+", "Students Registered"],
  [BriefcaseBusiness, "500+", "Job Opportunities Shared"],
  [Target, "95%", "Placement Assistance"]
];

const steps = [
  ["01", UserRound, "Create Your Profile", "Register and provide your basic academic, personal and career information."],
  ["02", ClipboardCheck, "Complete Your Profile", "Add your education, skills, certifications, projects, preferred locations and career interests."],
  ["03", GraduationCap, "Build Your Skills", "Participate in training programs, assessments, CRT programs and skill-development activities."],
  ["04", Target, "Discover Opportunities", "Get access to relevant internships, job openings, placement drives and hiring opportunities."],
  ["05", ShieldCheck, "Get Shortlisted", "Your profile can be evaluated based on eligibility, skills, academic criteria, assessments and company requirements."],
  ["06", Send, "Get Connected", "Shortlisted students receive relevant Job Descriptions, interview information and further placement instructions."]
];

const studentActions = [
  [UserRound, "01", "Student Profile", "Create and maintain your complete professional profile."],
  [GraduationCap, "02", "Training & CRT Programs", "Access skill-development and Campus Recruitment Training programs."],
  [Trophy, "03", "Skill Assessments", "Participate in assessments designed to understand your current skill level and employability."],
  [BriefcaseBusiness, "04", "Job Opportunities", "Explore relevant openings from companies hiring fresh talent."],
  [Building2, "05", "Placement Drives", "Stay updated about upcoming campus and off-campus placement opportunities."],
  [Bell, "06", "Job Alerts", "Receive opportunities that match your profile and eligibility."],
  [FileText, "07", "Application Tracking", "Track the opportunities you have applied for and your placement journey."]
];

const whyRegister = [
  "Receive relevant job opportunities",
  "Get notified about placement drives",
  "Receive company-specific Job Descriptions",
  "Participate in recruitment processes",
  "Access training and skill-development programs",
  "Build your professional profile",
  "Improve your employability through assessments and training"
];

const opportunities = [
  [BriefcaseBusiness, "Full-Time Jobs", "Start your professional career with hiring companies."],
  [Rocket, "Internships", "Gain practical industry experience."],
  [Building2, "Campus Placement Drives", "Participate in company recruitment drives through your college."],
  [Target, "Off-Campus Opportunities", "Explore opportunities beyond your campus."],
  [Trophy, "Training & Certification Programs", "Develop the skills required by today's industry."]
];

const footerColumns = [
  ["Quick Links", "Home", "About", "Opportunities", "Training", "Placements", "Contact"],
  ["Student", "Register", "Login", "My Profile", "Opportunities", "Applications"],
  ["For Colleges", "Training Programs", "Student Management", "Placement Support"],
  ["For Companies", "Hire Talent", "Submit JD", "Recruitment Support"]
];

function Brand({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E] shadow-sm ring-1 ring-[#F43F5E]/10">
        <span className="mc-font-mono text-base font-bold tracking-tight">MC</span>
      </div>
      <div className="leading-tight">
        <p className={`text-lg font-semibold tracking-normal ${light ? "text-white" : "text-[#0A0A0A]"}`}>
          Magnus Copo
        </p>
        <p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${light ? "text-white/55" : "text-black/45"}`}>
          Connect · Learn · Grow
        </p>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, accent, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-xl"}>
      <div className={`inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#F43F5E] ${center ? "justify-center" : ""}`}>
        <span className="h-px w-6 bg-[#F43F5E]/50" />
        {eyebrow}
        <span className="h-px w-6 bg-[#F43F5E]/50" />
      </div>
      <h2 className="mt-4 text-3xl font-black leading-tight tracking-normal text-[#0A0A0A] sm:text-4xl">
        {title} {accent && <span className="text-[#F43F5E]">{accent}</span>}
      </h2>
    </div>
  );
}

function CTAButton({ to, children, variant = "solid", className = "" }) {
  const base =
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold transition duration-200 hover:-translate-y-0.5";
  const styles =
    variant === "solid"
      ? "bg-[#0A0A0A] text-white shadow-[0_18px_34px_rgba(10,10,10,0.18)] hover:bg-[#2B0A2E] hover:shadow-[0_24px_48px_rgba(43,10,46,0.22)]"
      : variant === "outline-light"
        ? "border border-[#0A0A0A] bg-white text-[#0A0A0A] hover:bg-[#F2F2F2]"
        : "border border-[#0A0A0A] bg-white text-[#0A0A0A] hover:bg-[#F2F2F2]";

  return (
    <Link to={to} className={`${base} ${styles} ${className}`}>
      {children}
      <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

function CropMarks() {
  return (
    <>
      <span className="pointer-events-none absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 border-[#F43F5E]/40" />
      <span className="pointer-events-none absolute -right-3 -top-3 h-6 w-6 border-r-2 border-t-2 border-[#F43F5E]/40" />
      <span className="pointer-events-none absolute -left-3 -bottom-3 h-6 w-6 border-b-2 border-l-2 border-[#F43F5E]/40" />
      <span className="pointer-events-none absolute -right-3 -bottom-3 h-6 w-6 border-b-2 border-r-2 border-[#F43F5E]/40" />
    </>
  );
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisible(true);
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, as: Tag = "div", delay = 0, className = "" }) {
  const [ref, visible] = useReveal();

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`landing-reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setMounted(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setMounted(true), 60);
    return () => window.clearTimeout(timer);
  }, []);

  return mounted;
}

function MountReveal({ children, as: Tag = "div", delay = 0, className = "" }) {
  const mounted = useMounted();

  return (
    <Tag
      style={{ transitionDelay: mounted ? `${delay}ms` : "0ms" }}
      className={`landing-reveal ${mounted ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

function JourneyRail() {
  const [railRef, railVisible] = useReveal();

  return (
    <div ref={railRef} className="relative mt-14">
      <div className="rail-track absolute left-0 right-0 top-8 hidden h-[2px] md:block" />
      <div className={`rail-fill absolute left-0 top-8 hidden h-[2px] w-full bg-[#F43F5E] md:block ${railVisible ? "is-visible" : ""}`} />
      <div className="relative grid gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {steps.map(([number, Icon, title, text], index) => (
          <Reveal as="article" key={number} delay={index * 100} className="relative flex flex-col items-center text-center">
            <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl border border-white/75 bg-white/85 text-[#F43F5E] shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur">
              <Icon size={24} />
            </div>
            <span className="mt-4 text-xs font-black tracking-[0.24em] text-[#F43F5E]">{number}</span>
            <h3 className="mt-2 text-base font-black text-[#0A0A0A]">{title}</h3>
            <p className="mx-auto mt-2 max-w-[15rem] text-xs font-medium leading-6 text-black/60">{text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useMounted();

  return (
    <main id="home" className={`landing-page landing-shell min-h-screen text-[#0A0A0A] ${mounted ? "is-mounted" : ""}`}>
      <style>{`
        .landing-page {
          --ink: #0A0A0A;
          --muted: rgba(0,0,0,0.6);
          --canvas: #fff;
          --accent: #F43F5E;
          --plum: #2B0A2E;
          background: var(--canvas);
          color: var(--ink);
          scroll-behavior: smooth;
        }

        @keyframes landingFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -12px, 0); }
        }

        .mc-font-display { font-family: inherit; }
        .mc-font-mono { font-family: inherit; }

        .landing-shell,
        .landing-hero {
          background:
            radial-gradient(circle at 12% 18%, rgba(244, 63, 94, 0.14), transparent 28%),
            radial-gradient(circle at 86% 12%, rgba(34, 197, 94, 0.13), transparent 26%),
            linear-gradient(115deg, rgba(236, 254, 255, 0.92), rgba(255, 255, 255, 0.9) 45%, rgba(255, 247, 237, 0.82));
        }

        .landing-grid,
        .hero-dot-field {
          background-image:
            linear-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.06) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: linear-gradient(to bottom, black, transparent 82%);
        }

        .landing-dark {
          background: #2B0A2E;
          color: #fff;
        }

        .landing-canvas {
          background: transparent;
          color: var(--ink);
        }

        .landing-panel {
          background: rgba(255,255,255,0.72);
          color: var(--ink);
        }

        .landing-reveal {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 720ms cubic-bezier(0.16,1,0.3,1), transform 720ms cubic-bezier(0.16,1,0.3,1);
          will-change: opacity, transform;
        }

        .landing-page.is-mounted .landing-reveal:not(.is-visible) {
          opacity: 0;
          transform: translateY(30px);
        }

        .landing-reveal.is-visible { opacity: 1; transform: translateY(0); }

        .hero-seal-enter {
          opacity: 1;
          transform: translateY(0) scale(1) rotate(8deg);
          transition: opacity 620ms cubic-bezier(0.16,1,0.3,1), transform 620ms cubic-bezier(0.16,1,0.3,1);
        }

        .landing-page.is-mounted .hero-seal-enter:not(.is-visible) {
          opacity: 0;
          transform: translateY(20px) scale(0.88) rotate(-8deg);
        }

        .hero-seal-enter.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1) rotate(8deg);
        }

        .landing-float { animation: landingFloat 5.8s ease-in-out infinite; }

        .rail-track { background: rgba(10,10,10,0.12); }
        .rail-fill {
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 1500ms cubic-bezier(0.16,1,0.3,1);
        }
        .rail-fill.is-visible { transform: scaleX(1); }

        .landing-page a:focus-visible,
        .landing-page button:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
          border-radius: 6px;
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-page * {
            animation: none !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Magnus Copo home">
            <Brand />
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-wide text-[#0A0A0A] lg:flex">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} className="group relative py-2 transition hover:text-[#F43F5E]">
                {label}
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-[#F43F5E] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden min-h-10 items-center gap-2 rounded-full border border-[#0A0A0A] bg-white px-5 text-sm font-semibold text-[#0A0A0A] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F2F2F2] sm:inline-flex"
            >
              <LogIn size={16} />
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex min-h-10 items-center rounded-full bg-[#0A0A0A] px-5 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(10,10,10,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2B0A2E]"
            >
              Register Now
            </Link>
            <button
              onClick={() => setMobileOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#0A0A0A]/15 bg-white text-[#0A0A0A] lg:hidden"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#E5E5E5] bg-white/95 px-4 py-4 lg:hidden">
            <nav className="grid gap-1">
              {navLinks.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-bold text-[#0A0A0A] hover:bg-[#FDEDF0] hover:text-[#F43F5E]"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-3 grid gap-2 border-t border-[#E5E5E5] pt-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0A0A0A] bg-white px-4 text-sm font-semibold text-[#0A0A0A]"
              >
                <LogIn size={16} /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#0A0A0A] px-4 text-sm font-semibold text-white"
              >
                Register Now
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="landing-hero relative overflow-hidden text-[#0A0A0A]">
        <div className="landing-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid min-h-[560px] w-full max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-[0.86fr_1.14fr] lg:px-8">
          <div className="z-10 max-w-xl">
            <MountReveal delay={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white/80 px-4 py-2 text-sm font-semibold text-[#2B0A2E] shadow-sm backdrop-blur">
              <Sparkles size={16} className="text-[#F43F5E]" />
              Student Career Portal
            </MountReveal>

            <h1 className="text-4xl font-black leading-[1.04] tracking-normal text-[#0A0A0A] sm:text-5xl lg:text-6xl">
              <MountReveal as="span" delay={100} className="block">Your Skills.</MountReveal>
              <MountReveal as="span" delay={200} className="block">Your Profile.</MountReveal>
              <MountReveal as="span" delay={300} className="block text-[#F43F5E]">Your Career.</MountReveal>
            </h1>

            <MountReveal delay={420} className="mt-7 max-w-lg text-base font-medium leading-7 text-black/60">
              Build your career profile once and get connected with the right training programs, job opportunities, and placement drives.
            </MountReveal>
            <MountReveal delay={480} className="mt-5 max-w-lg text-base font-medium leading-7 text-black/60">
              The Magnus Copo Student Portal connects students with career opportunities through skill development, assessments, training programs, and corporate hiring.
            </MountReveal>

            <MountReveal delay={560} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <CTAButton to="/register" variant="solid">Register Now</CTAButton>
              <CTAButton to="#opportunities" variant="outline-light">Explore Opportunities</CTAButton>
            </MountReveal>

            <MountReveal delay={640} className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-[#2B0A2E]">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E]">
                <ShieldCheck size={15} />
              </span>
              One profile. Multiple opportunities.
            </MountReveal>
          </div>

          <MountReveal delay={220} className="relative z-10 flex w-full items-center self-center">
            <div className="relative ml-auto w-full max-w-3xl">
              <img
                src={studentHero}
                alt="Student holding a laptop, ready for placement season"
                className="landing-float mx-auto w-full max-h-[460px] object-contain drop-shadow-[0_34px_58px_rgba(15,23,42,0.22)]"
              />

              <div
                style={{ transitionDelay: mounted ? "520ms" : "0ms" }}
                className={`hero-seal-enter absolute right-10 top-2 hidden h-16 w-16 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E] shadow-[0_18px_40px_rgba(15,23,42,0.14)] ring-1 ring-white/75 sm:grid ${mounted ? "is-visible" : ""}`}
              >
                <BadgeCheck size={26} />
              </div>
            </div>
          </MountReveal>
        </div>
      </section>

      <section id="about" className="landing-canvas relative py-20 sm:py-28">
        <div className="landing-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="About the Portal" title="Your Career Journey" accent="Starts Here" />
            <div className="mt-6 grid gap-4 text-sm font-medium leading-7 text-black/60">
              <p>
                The Magnus Copo Student Portal is designed to create a direct connection between students, colleges, training programs, and companies.
              </p>
              <p>
                Instead of filling multiple forms and spreadsheets for every placement drive, students can create their profile once and keep their information updated.
              </p>
              <p>
                Based on your education, skills, location, interests, assessment performance, and career preferences, relevant opportunities can be shared with you.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {stats.map(([Icon, value, label], index) => (
              <Reveal
                as="article"
                key={label}
                delay={index * 90}
                className="landing-float flex items-center gap-5 rounded-[24px] border border-white/75 bg-white/85 p-7 shadow-[0_28px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#F43F5E]/40"
                style={{ animationDelay: `${index * 180}ms` }}
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E]">
                  <Icon size={26} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-3xl font-black leading-none text-[#0A0A0A]">{value}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-black/55">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="placements" className="landing-panel relative py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="How It Works" title="From Registration to Placement" center />
          </Reveal>
          <JourneyRail />
        </div>
      </section>

      <section id="training" className="landing-canvas relative py-20 sm:py-28">
        <div className="landing-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="What Students Can Do" title="Everything You Need for Your" accent="Career Journey" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {studentActions.map(([Icon, code, title, text], index) => (
                <article
                  key={title}
                  className={`group relative rounded-[24px] border border-white/75 bg-white/85 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#F43F5E]/40 ${index === studentActions.length - 1 ? "sm:col-span-2" : ""}`}
                >
                  <span className="absolute right-5 top-5 text-[11px] font-black tracking-widest text-black/20 transition group-hover:text-[#F43F5E]">
                    {code}
                  </span>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E]">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-sm font-black text-[#0A0A0A]">{title}</h3>
                  <p className="mt-2 text-xs font-medium leading-6 text-black/60">{text}</p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SectionHeading eyebrow="Why Register?" title="Register Once. Stay Connected to" accent="Opportunities." />
            <p className="mt-6 text-sm font-medium leading-7 text-black/60">
              Your profile helps us understand your career goals and connect you with opportunities that match your background.
            </p>
            <p className="mt-4 text-sm font-medium leading-7 text-black/60">By maintaining an updated profile, you can:</p>

            <ul className="mt-5 grid gap-2.5">
              {whyRegister.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/75 bg-white/85 px-4 py-3 text-sm font-bold text-[#0A0A0A] shadow-sm backdrop-blur transition hover:border-[#F43F5E]/40"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#FDEDF0] text-[#F43F5E]">
                    <CheckCircle2 size={14} strokeWidth={2.6} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <article className="relative mt-8 overflow-hidden rounded-[28px] border border-white/75 bg-white/85 p-7 text-[#0A0A0A] shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl">
              <CropMarks />
              <div className="grid gap-5 sm:grid-cols-[64px_1fr]">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E]">
                  <Rocket size={30} />
                </div>
                <div>
                  <h3 className="mc-font-display text-lg font-bold">Don&apos;t Wait for the Next Placement Drive.</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-black/60">
                    Create your profile today and stay ready for the next opportunity.
                  </p>
                  <Link
                    to="/register"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0A0A0A] px-5 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(10,10,10,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2B0A2E]"
                  >
                    Create My Profile
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section id="opportunities" className="landing-panel py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Career Opportunities" title="Opportunities That Match You" center />
            <p className="mx-auto mt-5 max-w-3xl text-center text-sm font-medium leading-7 text-black/60">
              We work with colleges, training programs, and corporate hiring requirements to identify suitable candidates for different opportunities.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {opportunities.map(([Icon, title, text], index) => (
              <Reveal
                as="article"
                key={title}
                delay={index * 90}
                className="group rounded-[24px] border border-white/75 bg-white/85 p-6 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#F43F5E]/40"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E] transition duration-300 group-hover:bg-[#F43F5E] group-hover:text-white">
                  <Icon size={26} />
                </div>
                <h3 className="mt-5 text-base font-black leading-tight text-[#0A0A0A]">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-black/60">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="landing-dark relative overflow-hidden bg-[#2B0A2E] text-white">
        <div className="h-[3px] w-full bg-[linear-gradient(90deg,#06b6d4,#22c55e,#F43F5E)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(244,63,94,0.25)_1.5px,transparent_2px)] bg-[length:22px_22px] opacity-[0.08]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <Brand light />
            <p className="mt-5 max-w-xs text-sm font-medium leading-6 text-white/60">
              Connecting students, institutions and companies through technology-driven learning and hiring solutions.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Magnus Copo on LinkedIn" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/75 transition hover:border-[#F43F5E] hover:text-[#F43F5E]">
                <Linkedin size={17} />
              </a>
              <a href="#" aria-label="Magnus Copo on Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/75 transition hover:border-[#F43F5E] hover:text-[#F43F5E]">
                <Instagram size={17} />
              </a>
            </div>
          </div>

          {footerColumns.map(([title, ...links]) => (
            <div key={title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#F43F5E]">{title}</h3>
              <div className="mt-4 grid gap-2 text-sm font-medium text-white/60">
                {links.map((link) => (
                  <a key={link} href={link === "Home" ? "#home" : "#"} className="w-fit transition hover:text-white">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="relative border-t border-white/10 py-5 text-center mc-font-mono text-xs font-medium text-white/50">
          © Magnus Copo. All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}
