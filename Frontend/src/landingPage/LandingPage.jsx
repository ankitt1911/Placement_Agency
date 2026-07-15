import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  GraduationCap,
  Instagram,
  Lightbulb,
  LineChart,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Twitter
} from "lucide-react";

const tagCloud = [
  "Next-Gen LMS",
  "Assessments",
  "Mock Interviews",
  "Placement Drives",
  "Skill Tracking",
  "Behavior Insights",
  "Student Analytics",
  "Faculty Portal",
  "Admin Dashboard",
  "Code Quality",
  "Plagiarism Detection",
  "Certification",
  "Company Mapping",
  "Placement Preparation",
  "AI Recommendations",
  "Campus Analytics",
  "Practice Bundles",
  "Aptitude Tests",
  "Technical Rounds",
  "Communication Skills",
  "Progress Tracking",
  "Report Generation",
  "Secure Platform",
  "Career Readiness",
  "Employability",
  "Institution Growth"
];

const tagPositions = [
  [5, 12, -7, 0.45, 0.85, -58, -34, 8, -10],
  [20, 4, 4, 0.55, 0.92, -16, -52, -10, 7],
  [41, 7, -2, 0.68, 1, 0, -60, 12, 9],
  [68, 5, 7, 0.55, 0.92, 22, -56, -8, -11],
  [82, 15, -5, 0.45, 0.84, 58, -35, 10, 8],
  [8, 28, 5, 0.62, 0.94, -66, -10, -12, 10],
  [26, 23, -3, 0.82, 1.04, -34, -42, 14, -8],
  [55, 20, 4, 0.78, 1.02, 18, -50, -11, 9],
  [76, 30, -6, 0.64, 0.94, 62, -16, 13, -7],
  [2, 48, -2, 0.42, 0.83, -72, 4, -8, -12],
  [15, 57, 6, 0.58, 0.92, -60, 28, 11, 8],
  [29, 66, -5, 0.68, 0.96, -28, 48, -13, -9],
  [67, 61, 5, 0.66, 0.98, 28, 44, 12, -10],
  [84, 52, -4, 0.52, 0.9, 66, 12, -10, 12],
  [10, 77, 4, 0.42, 0.84, -62, 56, 9, -8],
  [42, 80, -3, 0.56, 0.92, -8, 62, -12, 10],
  [70, 78, 6, 0.46, 0.86, 34, 58, 10, 8],
  [34, 36, 2, 0.92, 1.08, -20, -18, -15, 11],
  [59, 39, -2, 0.9, 1.08, 24, -20, 14, -12],
  [21, 39, 6, 0.78, 1, -50, 0, 12, 10],
  [78, 42, -7, 0.7, 0.98, 54, 2, -13, 9],
  [4, 65, -5, 0.4, 0.82, -74, 36, 10, -11],
  [52, 66, 3, 0.62, 0.94, 12, 54, -14, 8],
  [87, 71, 5, 0.38, 0.82, 70, 48, 11, -9],
  [13, 8, -4, 0.38, 0.82, -54, -54, -9, 12],
  [90, 24, 4, 0.4, 0.84, 72, -24, 13, 10]
];

const stats = [
  ["1", "Unified LMS, assessments, exams and placement workflow"],
  ["360°", "Student development visibility for every institution"],
  ["AI", "Recommendations backed by analytics and behavior insights"]
];

const placementLogos = [
  "TCS",
  "Wipro",
  "Infosys",
  "Capgemini",
  "Tech Mahindra",
  "Cognizant",
  "Google",
  "IBM",
  "Accenture",
  "Amazon",
  "Cisco",
  "L&T",
  "Microsoft",
  "SAP",
  "Tata",
  "Zoho"
];

const learningFeatures = [
  {
    icon: BarChart3,
    title: "Real-time performance analytics",
    text: "Stay updated with live performance data as students learn and grow. Make smarter academic decisions backed by instant analytics.",
    points: ["Smart content recommendations", "Adaptive assessments", "Learning analytics dashboard", "Mobile-first interface"]
  },
  {
    icon: BrainCircuit,
    title: "Behavior insights",
    text: "Gain clarity on student behavior with engagement analytics and timely intervention signals.",
    points: ["Student progress tracking", "Engagement metrics", "Placement readiness scores", "Custom report generation"]
  },
  {
    icon: Target,
    title: "Skill-level tracking",
    text: "Track student development at every stage and connect skills with placement outcomes.",
    points: ["Competency mapping", "Skill gap analysis", "Industry alignment tracking", "Certification management"]
  },
  {
    icon: FileCheck2,
    title: "Formative assessments",
    text: "Run continuous formative evaluations, identify gaps early and improve code quality.",
    points: ["Multi-language support", "Auto-graded submissions", "Plagiarism detection", "Code quality analysis"]
  },
  {
    icon: Sparkles,
    title: "AI-driven recommendations",
    text: "Support learners with AI-powered guidance, data-backed suggestions and targeted practice.",
    points: ["Live leaderboards", "Custom problem sets", "Team competitions", "Prize management"]
  }
];

const platformHighlights = [
  {
    title: "Student Portal",
    text: "Personalized dashboards with course access, progress tracking and skill development metrics.",
    points: ["Course enrollment", "Assignment submission", "Performance analytics", "Placement preparation"]
  },
  {
    title: "Faculty Portal",
    text: "Tools for content creation, student monitoring and comprehensive analytics.",
    points: ["Course management", "Grading automation", "Student insights", "Resource library"]
  },
  {
    title: "Admin Dashboard",
    text: "Institution-wide analytics, placement tracking and comprehensive reporting.",
    points: ["Campus analytics", "Placement outcomes", "Department insights", "ROI tracking"]
  }
];

const whyChoose = [
  [Lightbulb, "One Platform. Complete Learning & Employability.", "Say goodbye to juggling multiple tools. Assessments, learning modules, coding practice and placement preparation stay unified in one seamless experience."],
  [LineChart, "Data-Driven Decisions", "Give institutions the visibility to improve outcomes through practical analytics and live reports."],
  [GraduationCap, "360° Student Development", "Track academic progress, skill growth, readiness scores and career preparation together."],
  [ShieldCheck, "Enterprise Grade Security", "Keep institutional workflows, student records and analytics protected."],
  [Building2, "Chosen by Forward-Thinking Institutions", "Built for colleges that want measurable student success and stronger placement outcomes."]
];

const footerGroups = [
  ["Quick Links", "Home", "For Business", "For Colleges", "For Corporates", "Blog", "Contact"],
  ["Solutions", "EdTech Platform", "Training Programs", "Placement Services", "Corporate Hiring", "Business Solutions"],
  ["Contact", "Marketing@magnuscopo.com", "+91 7353444013", "#33 1st Layout, Bengaluru - 560016"]
];

/* ---------------------------------------------------------------------- */
/* Scroll-reveal: elements fade/rise into place the first time they enter */
/* the viewport. Anything already on-screen at load reveals immediately   */
/* because IntersectionObserver fires as soon as it starts observing.     */
/* ---------------------------------------------------------------------- */

function useReveal({ threshold = 0.16, rootMargin = "0px 0px -8% 0px" } = {}) {
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible];
}

function Reveal({ children, as: Tag = "div", variant = "up", delay = 0, className = "", ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant}${visible ? " is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Wordmark({ light = false }) {
  return (
    <span className={`text-2xl font-semibold tracking-normal ${light ? "text-white" : "text-[#0A0A0A]"}`}>
      Magnus <span className="text-[#F43F5E]">Copo</span>
    </span>
  );
}

function PillButton({ children, to = "/", variant = "dark", className = "" }) {
  const styles = variant === "dark"
    ? "bg-[#0A0A0A] text-white hover:bg-[#2B0A2E]"
    : "border border-[#0A0A0A] bg-white text-[#0A0A0A] hover:bg-[#F2F2F2]";

  return (
    <Link to={to} className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition ${styles} ${className}`}>
      {children}
    </Link>
  );
}

function FeaturePanel({ icon: Icon, title, text, points, tinted = false }) {
  return (
    <article className={`rounded-[24px] p-7 sm:p-8 ${tinted ? "bg-[#FDEDF0]" : "bg-white"}`}>
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E]">
        <Icon size={24} strokeWidth={1.8} />
      </div>
      <h3 className="mt-6 text-xl font-bold leading-tight text-[#0A0A0A]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-black/60">{text}</p>
      <ul className="mt-5 grid gap-2 text-sm font-medium text-black/64">
        {points.map((point) => (
          <li key={point} className="flex gap-2">
            <CheckCircle2 className="mt-0.5 shrink-0 text-[#F43F5E]" size={15} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function LandingPage() {
  const fieldRef = useRef(null);
  const repelRefs = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(null);

  /* Cursor-reactive floating chips: on every mousemove over the hero tag
     field, each chip pushes away from the pointer with a strength that
     falls off with distance, layered on top of its ambient float. */
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return undefined;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const RADIUS = 170;
    const MAX_PUSH = 46;

    const applyRepel = () => {
      rafRef.current = null;
      const { x, y, active } = pointerRef.current;

      repelRefs.current.forEach((el) => {
        if (!el) return;
        if (!active) {
          el.style.setProperty("--repel-x", "0px");
          el.style.setProperty("--repel-y", "0px");
          return;
        }
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - x;
        const dy = cy - y;
        const dist = Math.hypot(dx, dy) || 1;

        if (dist < RADIUS) {
          const strength = ((RADIUS - dist) / RADIUS) * MAX_PUSH;
          el.style.setProperty("--repel-x", `${(dx / dist) * strength}px`);
          el.style.setProperty("--repel-y", `${(dy / dist) * strength}px`);
        } else {
          el.style.setProperty("--repel-x", "0px");
          el.style.setProperty("--repel-y", "0px");
        }
      });
    };

    const schedule = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(applyRepel);
      }
    };

    const handleMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
      schedule();
    };

    const handleLeave = () => {
      pointerRef.current = { ...pointerRef.current, active: false };
      schedule();
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    field.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      field.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main className="wellfound-page min-h-[100dvh] bg-white text-[#0A0A0A]">
      <style>{`
        .wellfound-page {
          --ink-black: #0A0A0A;
          --brand-plum: #2B0A2E;
          --brand-red: #F43F5E;
          --soft-pink: #FDEDF0;
          font-family: "Söhne", "Inter", "Helvetica Neue", Arial, sans-serif;
        }

        .wf-container {
          width: min(100% - 40px, 1200px);
          margin-inline: auto;
        }

        /* ---------------- Page-load entrance ---------------- */

        @keyframes pageFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .load-in {
          opacity: 0;
          animation: pageFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .load-in-header { animation-delay: 0.02s; }
        .load-in-badge { animation-delay: 0.55s; }
        .load-in-h1 { animation-delay: 0.68s; }
        .load-in-p { animation-delay: 0.82s; }
        .load-in-cta { animation-delay: 0.94s; }
        .load-in-cue { animation-delay: 1.1s; }

        /* ---------------- Scroll-triggered reveal ---------------- */

        .reveal {
          opacity: 0;
          transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .reveal-up { transform: translateY(34px); }
        .reveal-up-sm { transform: translateY(16px); }
        .reveal-scale { transform: translateY(16px) scale(0.94); }
        .reveal-left { transform: translateX(-30px); }
        .reveal-right { transform: translateX(30px); }
        .reveal-fade { transform: none; }
        .reveal.is-visible { opacity: 1; transform: none; }

        /* ---------------- Hero tag field ---------------- */

        .tag-pill {
          position: absolute;
          left: var(--x);
          top: var(--y);
          z-index: 1;
          opacity: 0;
          transform: translate3d(var(--from-x), var(--from-y), 0) scale(0.7) rotate(var(--rot));
          transform-origin: center;
          animation:
            tagFlowIn 1.25s cubic-bezier(0.16, 1, 0.3, 1) forwards,
            tagRandomFlow var(--dur) ease-in-out infinite;
          animation-delay: var(--enter-delay), calc(var(--enter-delay) + 1.2s + var(--float-delay));
          cursor: default;
          will-change: transform, opacity;
        }

        .tag-repel {
          transform: translate3d(var(--repel-x, 0px), var(--repel-y, 0px), 0);
          transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .tag-pill-inner {
          display: inline-flex;
          white-space: nowrap;
          border-radius: 999px;
          border: 1px solid #E5E5E5;
          background: #F7F7F7;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
          transition:
            background-color 180ms ease,
            border-color 180ms ease,
            box-shadow 220ms ease,
            color 180ms ease,
            filter 220ms ease,
            transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1.25);
        }

        .tag-pill:hover {
          z-index: 8;
          --opacity: 1;
          animation-play-state: paused;
        }

        .tag-pill:hover .tag-pill-inner {
          background: #ffffff;
          border-color: rgba(244, 63, 94, 0.55);
          color: #2B0A2E;
          box-shadow:
            0 0 0 5px rgba(244, 63, 94, 0.1),
            0 16px 36px rgba(244, 63, 94, 0.2),
            0 4px 12px rgba(0, 0, 0, 0.08);
          filter: saturate(1.1);
          transform: scale(1.22);
        }

        @keyframes tagFlowIn {
          0% {
            opacity: 0;
            transform: translate3d(var(--from-x), var(--from-y), 0) scale(0.7) rotate(calc(var(--rot) - 10deg));
          }
          68% {
            opacity: 1;
            transform: translate3d(calc(var(--flow-x) * -0.38), calc(var(--flow-y) * -0.38), 0) scale(calc(var(--scale) * 1.06)) rotate(calc(var(--rot) + 2deg));
          }
          100% {
            opacity: var(--opacity);
            transform: translate3d(0, 0, 0) scale(var(--scale)) rotate(var(--rot));
          }
        }

        @keyframes tagRandomFlow {
          0%, 100% {
            opacity: var(--opacity);
            transform: translate3d(0, 0, 0) scale(var(--scale)) rotate(var(--rot));
          }
          25% {
            transform: translate3d(var(--flow-x), calc(var(--flow-y) * -0.55), 0) scale(var(--scale)) rotate(calc(var(--rot) + 3deg));
          }
          50% {
            transform: translate3d(calc(var(--flow-x) * -0.75), var(--flow-y), 0) scale(var(--scale)) rotate(calc(var(--rot) - 2deg));
          }
          75% {
            transform: translate3d(calc(var(--flow-x) * 0.45), calc(var(--flow-y) * 0.8), 0) scale(var(--scale)) rotate(calc(var(--rot) + 1deg));
          }
        }

        .scroll-cue {
          animation: cueBounce 1.5s ease-in-out infinite;
        }

        @keyframes cueBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .tag-pill, .scroll-cue, .load-in { animation: none; opacity: var(--opacity, 1); transform: scale(var(--scale, 1)) rotate(var(--rot, 0deg)); }
          .tag-pill:hover .tag-pill-inner { transform: scale(1.12); }
          .tag-repel { transition: none; transform: none; }
          .reveal { transition: none; opacity: 1; transform: none; }
        }
      `}</style>

      <header className="load-in load-in-header sticky top-0 z-50 border-b border-[#E5E5E5] bg-white/95 backdrop-blur">
        <div className="wf-container flex h-[72px] items-center justify-between gap-6">
          <Link to="/" aria-label="Magnus Copo home">
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#business" className="hover:text-[#F43F5E]">For Business</a>
            <a href="#colleges" className="hover:text-[#F43F5E]">For Colleges</a>
            <a href="#corporates" className="hover:text-[#F43F5E]">For Corporates</a>
            <a href="#blog" className="hover:text-[#F43F5E]">Blog</a>
            <a href="#contact" className="hover:text-[#F43F5E]">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#F2F2F2] sm:inline-flex">
              Log In
            </Link>
            <Link to="/register" className="inline-flex min-h-10 items-center rounded-full bg-[#0A0A0A] px-5 text-sm font-semibold text-white transition hover:bg-[#2B0A2E]">
              Get Started
            </Link>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-[#E5E5E5] md:hidden" aria-label="Open navigation">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <section id="business" className="relative overflow-hidden bg-white pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div ref={fieldRef} className="absolute inset-x-0 top-8 h-[520px]" aria-hidden="true">
          {tagCloud.map((tag, index) => {
            const [x, y, rotation, opacity, scale, fromX, fromY, flowX, flowY] = tagPositions[index];
            return (
              <span
                key={tag}
                className="tag-pill"
                style={{
                  "--x": `${x}%`,
                  "--y": `${y}%`,
                  "--rot": `${rotation}deg`,
                  "--opacity": opacity,
                  "--scale": scale,
                  "--from-x": `${fromX}vw`,
                  "--from-y": `${fromY}vh`,
                  "--flow-x": `${flowX}px`,
                  "--flow-y": `${flowY}px`,
                  "--dur": `${5.8 + (index % 6) * 0.7}s`,
                  "--enter-delay": `${index * 55}ms`,
                  "--float-delay": `${(index % 8) * -0.7}s`
                }}
              >
                <span ref={(el) => (repelRefs.current[index] = el)} className="tag-repel">
                  <span className="tag-pill-inner">{tag}</span>
                </span>
              </span>
            );
          })}
        </div>

        <div className="wf-container relative z-10 flex min-h-[560px] flex-col items-center justify-center text-center">
          <div className="load-in load-in-badge inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-bold text-[#5C1A3D] shadow-sm">
            <GraduationCap size={16} />
            For Educational Institutions
          </div>
          <h1 className="load-in load-in-h1 mt-8 max-w-4xl text-5xl font-bold leading-none tracking-normal sm:text-6xl lg:text-[68px]">
            Concerned about <span className="text-[#F43F5E]">placement outcomes?</span>
          </h1>
          <p className="load-in load-in-p mt-7 max-w-2xl text-lg font-medium leading-8 text-black/60">
            Let us help bridge your student&apos;s skill gap with next-gen LMS, assessments and exams.
          </p>
          <div className="load-in load-in-cta mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PillButton to="/register">Improve Placement Readiness</PillButton>
            <PillButton to="#colleges" variant="light">Explore Platform</PillButton>
          </div>
          <a href="#colleges" className="load-in load-in-cue scroll-cue mt-10 grid h-11 w-11 place-items-center rounded-full bg-[#0A0A0A] text-white" aria-label="Scroll to platform features">
            <ArrowDown size={19} />
          </a>
        </div>
      </section>

      <section id="colleges" className="bg-white pb-20">
        <div className="wf-container">
          <Reveal variant="up" className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-[#5C1A3D]">Next-Gen LMS, Assessments & Exams</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight">Build stronger learning and placement outcomes</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {learningFeatures.map((feature, index) => (
              <Reveal as="div" key={feature.title} variant="up" delay={index * 90}>
                <FeaturePanel {...feature} tinted={index === 1 || index === 4} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#2B0A2E] py-20 text-white">
        <div className="wf-container">
          <div className="grid gap-10 text-center md:grid-cols-3 md:divide-x md:divide-white/15">
            {stats.map(([value, label], index) => (
              <Reveal as="div" key={label} variant="up" delay={index * 110} className="px-6">
                <p className="text-5xl font-bold leading-none sm:text-6xl">{value}</p>
                <p className="mt-4 text-sm font-medium text-white/70">{label}</p>
              </Reveal>
            ))}
          </div>
          <div className="my-14 h-px bg-white/15" />
          <Reveal variant="fade" as="p" className="text-center text-xl font-bold text-white">
            Preparing students for success at top companies
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 text-center text-lg font-bold text-white/58 sm:grid-cols-4 lg:grid-cols-8">
            {placementLogos.map((logo, index) => (
              <Reveal as="span" key={logo} variant="scale" delay={index * 45} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                {logo}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="corporates" className="bg-white py-20">
        <div className="wf-container">
          <Reveal variant="up" className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-[#5C1A3D]">Placement Drive Preparation</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight">Mock interviews, test bundles and unlimited attempts</h2>
            <p className="mt-4 text-base leading-7 text-black/60">
              Practice with company-style questions and analysis after every test based on top companies&apos; question patterns.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 rounded-[24px] bg-[#FDEDF0] p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:p-14">
            <Reveal variant="left" className="flex flex-col justify-center">
              <h3 className="text-3xl font-bold leading-tight sm:text-4xl">Platform <span className="text-[#F43F5E]">Highlights</span></h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-black/64">
                Comprehensive portals for students, faculty and administrators, all connected through one institution-ready system.
              </p>
              <PillButton className="mt-8 w-fit">Schedule Demo</PillButton>
            </Reveal>
            <div className="grid gap-4">
              {platformHighlights.map((highlight, index) => (
                <Reveal as="article" key={highlight.title} variant="right" delay={index * 110} className="rounded-2xl bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
                  <h4 className="text-lg font-bold">{highlight.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-black/60">{highlight.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {highlight.points.map((point) => (
                      <span key={point} className="rounded-full bg-[#F2F2F2] px-3 py-1 text-xs font-bold text-black/62">{point}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="blog" className="bg-white pb-20">
        <div className="wf-container grid gap-5 lg:grid-cols-2">
          <Reveal as="article" variant="left" className="rounded-[24px] bg-[#F4B740] p-8 sm:p-10">
            <p className="text-sm font-bold">For Institutions</p>
            <h2 className="mt-4 text-4xl font-bold">One platform for complete learning and employability</h2>
            <p className="mt-5 max-w-xl text-base leading-7">
              Say goodbye to juggling multiple tools. Magnus Copo brings learning, assessments, exams, coding practice and placement preparation into one experience.
            </p>
            <Link to="/" className="mt-7 inline-flex items-center gap-2 font-bold">Explore solution <ArrowRight size={18} /></Link>
          </Reveal>
          <Reveal as="article" variant="right" delay={100} className="rounded-[24px] bg-[#5C1A3D] p-8 text-white sm:p-10">
            <p className="text-sm font-bold">Why Choose Us</p>
            <h2 className="mt-4 text-4xl font-bold">Designed for forward-thinking institutions</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/78">
              Improve placement outcomes with data-driven decisions, skill visibility and secure workflows for every stakeholder.
            </p>
            <Link to="/" className="mt-7 inline-flex items-center gap-2 font-bold">Learn more <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="wf-container">
          <Reveal variant="up" className="mb-9">
            <p className="text-sm font-semibold text-[#5C1A3D]">Why Choose Us</p>
            <h2 className="mt-2 text-4xl font-bold">Built to improve student outcomes</h2>
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
            <Reveal as="article" variant="left" className="rounded-[24px] bg-white p-7 shadow-[0_18px_45px_rgba(0,0,0,0.1)]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FDEDF0] text-[#F43F5E]">
                <Trophy size={24} />
              </div>
              <h3 className="mt-5 text-xl font-bold">{whyChoose[0][1]}</h3>
              <p className="mt-3 text-base leading-7 text-black/62">{whyChoose[0][2]}</p>
            </Reveal>
            <div className="grid gap-4">
              {whyChoose.slice(1).map(([Icon, title, text], index) => (
                <Reveal as="article" key={title} variant="right" delay={index * 100} className="grid grid-cols-[44px_1fr] gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FDEDF0] text-[#F43F5E]">
                    <Icon size={21} />
                  </div>
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-black/58">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#2B0A2E] text-white">
        <div className="border-b border-white/10 py-5">
          <div className="wf-container flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/74">
            {["EdTech Platform", "Training Programs", "Placement Services", "Corporate Hiring", "Business Solutions"].map((item) => (
              <button key={item} className="inline-flex items-center gap-1 hover:text-white">{item} <ChevronDown size={14} /></button>
            ))}
          </div>
        </div>
        <div className="wf-container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
          <Reveal variant="up">
            <Wordmark light />
            <p className="mt-4 max-w-xs text-sm font-medium text-white/62">Your vision our execution</p>
          </Reveal>
          {footerGroups.map(([title, ...links], index) => (
            <Reveal as="div" key={title} variant="up" delay={index * 90}>
              <h3 className="font-bold">{title}</h3>
              <div className="mt-4 grid gap-2 text-sm text-white/62">
                {links.map((link) => <Link key={link} to="/" className="hover:text-white">{link}</Link>)}
              </div>
            </Reveal>
          ))}
        </div>
        <div className="wf-container border-t border-white/10 py-7">
          <div className="flex flex-col gap-5 text-sm text-white/58 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-3">
              <Twitter size={18} />
              <Instagram size={18} />
            </div>
            <p>Copyright © 2026 Magnus Copo. All rights reserved.</p>
            <div className="flex gap-5">
              <Link to="/" className="hover:text-white">Privacy Policy</Link>
              <Link to="/" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}