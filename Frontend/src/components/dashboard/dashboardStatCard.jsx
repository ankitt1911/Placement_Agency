import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";

const variants = [
  {
    card: "border-portal-blushBorder bg-portal-blush",
    icon: "bg-portal-pink text-white",
    value: "text-rose-700",
    chip: "bg-rose-100 text-rose-700"
  },
  {
    card: "border-purple-100 bg-portal-lavender",
    icon: "bg-portal-purple text-white",
    value: "text-portal-purple",
    chip: "bg-purple-100 text-purple-700"
  },
  {
    card: "border-blue-100 bg-portal-mint",
    icon: "bg-blue-600 text-white",
    value: "text-blue-700",
    chip: "bg-blue-100 text-blue-700"
  },
  {
    card: "border-blue-100 bg-portal-sky",
    icon: "bg-blue-600 text-white",
    value: "text-blue-700",
    chip: "bg-blue-100 text-blue-700"
  },
  {
    card: "border-amber-100 bg-portal-amber",
    icon: "bg-portal-orange text-white",
    value: "text-amber-700",
    chip: "bg-amber-100 text-amber-700"
  }
];

const parseAnimatedValue = (value) => {
  if (typeof value === "number") return { target: value, suffix: "", numeric: true };
  const text = String(value ?? "");
  const match = text.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { target: 0, suffix: "", numeric: false, text };
  return { target: Number(match[1]), suffix: match[2] || "", numeric: true };
};

const formatAnimatedValue = (value, target, suffix) => {
  const precision = Number.isInteger(target) ? 0 : 1;
  return `${value.toLocaleString(undefined, { maximumFractionDigits: precision, minimumFractionDigits: precision })}${suffix}`;
};

export default function DashboardStatCard({ label, value, helper, icon: Icon = BarChart3, tone = 0 }) {
  const variant = variants[tone % variants.length];
  const animatedValue = useMemo(() => parseAnimatedValue(value), [value]);
  const [displayValue, setDisplayValue] = useState(() => animatedValue.numeric ? formatAnimatedValue(0, animatedValue.target, animatedValue.suffix) : animatedValue.text);

  useEffect(() => {
    if (!animatedValue.numeric) {
      setDisplayValue(animatedValue.text);
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(formatAnimatedValue(animatedValue.target, animatedValue.target, animatedValue.suffix));
      return undefined;
    }

    const duration = 900;
    const start = performance.now();
    let frameId;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(formatAnimatedValue(animatedValue.target * eased, animatedValue.target, animatedValue.suffix));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    setDisplayValue(formatAnimatedValue(0, animatedValue.target, animatedValue.suffix));
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [animatedValue]);

  return (
    <div className={`group relative overflow-hidden rounded-3xl border p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.14)] ${variant.card}`}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/55 transition duration-500 group-hover:scale-125" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80" />
      <div className="relative flex items-start justify-between gap-3">
        <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-4 ring-white/60 transition duration-300 group-hover:rotate-3 group-hover:scale-105 ${variant.icon}`}>
          <Icon className="h-4 w-4" />
        </span>
        <p className={`text-right text-3xl font-extrabold leading-none ${variant.value}`}>{displayValue}</p>
      </div>
      <div className="relative mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-portal-ink">{label}</p>
          {helper ? <p className="mt-1 text-xs text-portal-muted">{helper}</p> : null}
        </div>
        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${variant.chip}`}>Live</span>
      </div>
    </div>
  );
}
