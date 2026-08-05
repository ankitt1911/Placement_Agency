import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Radio } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { handleGetActiveBroadcasts } from "../../Services/apiCalling/broadcastApis";
import { themeFor } from "./broadcastConstants";

const ROTATE_MS = 7000;

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 60 : -60, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -60 : 60, scale: 0.97 })
};

export default function StudentBroadcastBanner() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    handleGetActiveBroadcasts().then((data) => setBroadcasts(data || []));
  }, []);

  const total = broadcasts.length;

  const go = useCallback((step) => {
    setDirection(step);
    setIndex((current) => (current + step + total) % total);
  }, [total]);

  useEffect(() => {
    if (total < 2 || paused) return undefined;
    const timer = globalThis.setInterval(() => go(1), ROTATE_MS);
    return () => globalThis.clearInterval(timer);
  }, [total, paused, go]);

  if (!total) return null;

  const current = broadcasts[Math.min(index, total - 1)];
  const theme = themeFor(current.category);
  const Icon = theme.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.gradient} p-[1.5px] shadow-[0_24px_60px_rgba(15,23,42,0.22)]`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-br ${theme.gradient}`}>
        {/* Drifting aurora blobs behind the content. */}
        {!reduceMotion ? (
          <>
            <motion.span
              aria-hidden="true"
              className={`pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full ${theme.glow} blur-3xl`}
              animate={{ x: [0, 60, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-white/20 blur-3xl"
              animate={{ x: [0, -50, 0], y: [0, -25, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        ) : null}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_55%)]" />

        <div className="relative z-10 flex flex-col gap-4 px-5 py-6 sm:px-7 sm:py-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white backdrop-blur">
              <span className="relative flex h-2 w-2">
                {!reduceMotion ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" /> : null}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <Radio className="h-3.5 w-3.5" />
              Live Broadcast
            </span>
            {total > 1 ? (
              <div className="flex items-center gap-2">
                <button type="button" className="grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:bg-white/30" onClick={() => go(-1)} aria-label="Previous broadcast">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-white/90">{index + 1}/{total}</span>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:bg-white/30" onClick={() => go(1)} aria-label="Next broadcast">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>

          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={current.id}
              custom={direction}
              variants={reduceMotion ? undefined : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start"
            >
              <motion.span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur"
                animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon className="h-7 w-7" />
              </motion.span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">{current.category}</span>
                  {current.priority === "High" ? (
                    <motion.span
                      className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-600"
                      animate={reduceMotion ? undefined : { opacity: [1, 0.55, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    >
                      Priority
                    </motion.span>
                  ) : null}
                </div>
                <motion.h2
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="mt-2 text-xl font-black leading-tight text-white drop-shadow-sm sm:text-2xl"
                >
                  {current.title}
                </motion.h2>
                <motion.p
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.4 }}
                  className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-white/90"
                >
                  {current.message}
                </motion.p>
                {current.linkUrl ? (
                  <motion.a
                    href={current.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26, duration: 0.4 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-900 shadow-lg"
                  >
                    {current.linkLabel || "Know more"}
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.a>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>

          {total > 1 ? (
            <div className="flex items-center gap-1.5">
              {broadcasts.map((item, dot) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show broadcast ${dot + 1}`}
                  onClick={() => { setDirection(dot > index ? 1 : -1); setIndex(dot); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${dot === index ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
              {/* Restarts on every slide change, so it always tracks the live timer. */}
              {!reduceMotion && !paused ? (
                <motion.span
                  key={`${current.id}-progress`}
                  className="ml-2 h-1.5 flex-1 origin-left rounded-full bg-white/30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
