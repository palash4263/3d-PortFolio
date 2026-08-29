import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { Link } from "react-router-dom";

import Footer from "../components/Footer";

import { projects, skills } from "../constants";

import sakura from "../assets/sakura.mp3";
import { soundoff, soundon } from "../assets/icons";

// Only the first few projects are surfaced on the landing page
const featuredProjects = projects.slice(0, 3);

// Hide "View project" until a real URL replaces the placeholder in constants
const isRealLink = (link) => link && !link.includes("your-live-link.com");

// Split the stack across two marquee rows that scroll in opposite directions
const midpoint = Math.ceil(skills.length / 2);
const marqueeRows = [skills.slice(0, midpoint), skills.slice(midpoint)];

/* Bold neon stops the name interpolates across, letter by letter */
const NAME_GRADIENT = [
  [0, 240, 255], // electric cyan
  [124, 92, 255], // violet
  [255, 43, 214], // hot magenta
];

const nameColorAt = (t) => {
  const scaled = t * (NAME_GRADIENT.length - 1);
  const i = Math.min(Math.floor(scaled), NAME_GRADIENT.length - 2);
  const f = scaled - i;
  const [a, b] = [NAME_GRADIENT[i], NAME_GRADIENT[i + 1]];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(", ")})`;
};

/* 🔠 Hero name: per-character 3D entrance, idle wave, and a click-to-scatter
   mode where every letter flies off and drifts until you click again. */
const AnimatedName = ({ text, className = "" }) => {
  const chars = [...text];
  const [scattered, setScattered] = useState(false);
  // Bumped on each scatter so the letters fly somewhere new every time
  const [seed, setSeed] = useState(0);

  const scatterTargets = useMemo(
    () =>
      chars.map(() => {
        const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        return {
          x: (Math.random() - 0.5) * vw * 0.7,
          y: (Math.random() - 0.5) * vh * 0.6,
          rotate: (Math.random() - 0.5) * 720,
          scale: 0.6 + Math.random() * 0.8,
          // Per-letter drift so they don't bob in unison once scattered
          driftX: (Math.random() - 0.5) * 80,
          driftY: (Math.random() - 0.5) * 80,
          duration: 4 + Math.random() * 4,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, chars.length]
  );

  const handleToggle = () => {
    if (!scattered) setSeed((s) => s + 1);
    setScattered((s) => !s);
  };

  return (
    <h1
      className={`neon-name-wrap ${className}`}
      aria-label={text}
      style={{ perspective: 900 }}
      onClick={handleToggle}
      title={scattered ? "Click to reassemble" : "Click to scatter"}
    >
      {chars.map((char, i) => {
        if (char === " ") return <span key={i}>&nbsp;&nbsp;</span>;

        const color = nameColorAt(i / Math.max(chars.length - 1, 1));
        const t = scatterTargets[i];

        return (
          // Outer span: one-time entrance. Inner span: idle wave / scatter.
          <motion.span
            key={i}
            aria-hidden="true"
            className="inline-block"
            initial={{
              opacity: 0,
              y: 120,
              rotateX: -95,
              scale: 0.6,
              filter: "blur(14px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              delay: 0.2 + i * 0.06,
              type: "spring",
              stiffness: 130,
              damping: 12,
            }}
          >
            <motion.span
              className="neon-char"
              style={{ color, position: "relative", zIndex: 20 }}
              animate={
                scattered
                  ? {
                      // Fly out, then drift around that point forever
                      x: [t.x, t.x + t.driftX, t.x],
                      y: [t.y, t.y + t.driftY, t.y],
                      rotate: [t.rotate, t.rotate + 25, t.rotate],
                      scale: t.scale,
                    }
                  : { x: 0, y: [0, -9, 0], rotate: 0, scale: 1 }
              }
              transition={
                scattered
                  ? {
                      x: {
                        duration: t.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      y: {
                        duration: t.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      rotate: {
                        duration: t.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      scale: { type: "spring", stiffness: 120, damping: 14 },
                    }
                  : {
                      x: { type: "spring", stiffness: 160, damping: 15 },
                      rotate: { type: "spring", stiffness: 160, damping: 15 },
                      scale: { type: "spring", stiffness: 160, damping: 15 },
                      y: {
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.12,
                      },
                    }
              }
              whileHover={
                scattered
                  ? undefined
                  : {
                      scale: 1.28,
                      y: -22,
                      color: "#ffffff",
                      transition: {
                        type: "spring",
                        stiffness: 420,
                        damping: 10,
                      },
                    }
              }
            >
              {char}
            </motion.span>
          </motion.span>
        );
      })}
    </h1>
  );
};

/* 🧲 Wrapper that pulls its child toward the cursor on hover */
const Magnetic = ({ children, strength = 0.35 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.6 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    // Offset from the element's centre, damped by `strength`
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

/* Headline where each word slides up from behind a mask */
const RevealHeading = ({ text, className = "" }) => (
  <h2 className={className}>
    {text.split(" ").map((word, i) => (
      <span
        key={i}
        className="inline-block overflow-hidden align-bottom mr-[0.25em]"
      >
        <motion.span
          className="inline-block"
          initial={{ y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            delay: i * 0.07,
            type: "spring",
            stiffness: 110,
            damping: 18,
          }}
        >
          {word}
        </motion.span>
      </span>
    ))}
  </h2>
);

const SkillPill = ({ skill }) => (
  <span
    title={skill.type}
    className="flex shrink-0 items-center gap-2.5 px-5 py-3 rounded-full bg-white/[0.04] border border-white/10 hover:border-cyan-300/50 hover:bg-white/[0.08] transition-colors"
  >
    <img
      src={skill.imageUrl}
      alt=""
      aria-hidden="true"
      className="w-5 h-5 object-contain"
    />
    <span className="text-sm font-medium text-slate-200 whitespace-nowrap">
      {skill.name}
    </span>
  </span>
);

const Home = () => {
  const audioRef = useRef(new Audio(sakura));

  const [currentStage, setCurrentStage] = useState(1);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    audioRef.current.volume = 0.4;
    audioRef.current.loop = true;

    if (isPlayingMusic) {
      audioRef.current.play();
    }

    return () => {
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section with Canvas */}
      <section className="w-full h-screen relative overflow-hidden">
        {/* Layered dramatic backdrop */}
        <div className="hero-aurora" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-beams" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />

        {/* Asymmetric left-aligned hero content */}
        <div className="absolute inset-0 z-5 flex items-center pointer-events-none">
          <div className="w-full max-w-6xl mx-auto px-6 md:px-4">
            <div className="max-w-3xl">
              {/* Availability status */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium tracking-wide text-slate-300">
                  Available for new opportunities
                </span>
              </motion.div>

              <AnimatedName
                text="Palash Mishra"
                className="neon-name text-5xl md:text-8xl font-bold mb-6 leading-[0.95] cursor-default pointer-events-auto"
              />

              {/* Specific value proposition instead of buzzwords */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-lg md:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl"
              >
                Full-stack engineer building scalable backend systems with{" "}
                <span className="text-white font-normal">Java, Spring Boot</span>{" "}
                and modern web apps with{" "}
                <span className="text-white font-normal">React</span>.
              </motion.p>

              {/* Credibility line */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-4 text-sm text-slate-500"
              >
                Previously Software Developer 2 at Oracle
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-10 flex flex-wrap items-center gap-4 pointer-events-auto"
              >
                <Link
                  to="/projects"
                  className="px-6 py-3 rounded-full font-semibold text-[#0a0a0c] bg-cyan-400 hover:bg-cyan-300 transition"
                >
                  View Projects
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-full font-semibold text-slate-200 border border-white/20 hover:bg-white/5 hover:border-white/40 transition"
                >
                  Get in Touch
                </Link>

                <div className="flex items-center gap-5 sm:ml-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition"
                  >
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 🎵 Music Toggle */}
        <div className="absolute top-8 right-8 z-10">
          <img
            src={!isPlayingMusic ? soundoff : soundon}
            alt="Toggle music"
            onClick={() => setIsPlayingMusic((prev) => !prev)}
            className="w-6 h-6 cursor-pointer object-contain opacity-40 hover:opacity-90 transition"
          />
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-8 right-8 z-5 flex items-center gap-3 pointer-events-none"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[11px] text-slate-500 tracking-[0.2em] uppercase">
            Scroll
          </span>
          <svg
            className="w-4 h-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="section-fade-from-hero w-full pt-28 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-14"
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-cyan-400 mb-3">
              Selected work
            </p>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight max-w-2xl">
              Things I've built.
            </h2>
          </motion.div>

          {/* Project Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <motion.article
                key={project.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                viewport={{ once: true, amount: 0.2 }}
                className="group rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-white/25 transition-colors duration-300"
              >
                {/* Preview: real screenshot when provided, branded fallback until then */}
                <div className="aspect-video w-full overflow-hidden border-b border-white/10">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={`${project.name} screenshot`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className={`w-full h-full ${project.theme} flex items-center justify-center opacity-90`}
                    >
                      <img
                        src={project.iconUrl}
                        alt={project.name}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {project.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300 bg-white/5 border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {isRealLink(project.link) && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                    >
                      Live site →
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition"
            >
              See all projects
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack — continuous marquee, denser than sparse category rows */}
      <section className="section-dark w-full py-24 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto px-6 mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-cyan-400 mb-4">
            Tech I work with
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-2xl">
            The tools I reach for.
          </h2>
        </motion.div>

        {/* Two rows scrolling in opposite directions; hover to pause */}
        <div className="space-y-4">
          {marqueeRows.map((row, i) => (
            <div key={i} className="marquee-viewport">
              <div className={`marquee-track ${i === 1 ? "is-reverse" : ""}`}>
                {/* Rendered twice so the loop is seamless */}
                {[...row, ...row].map((skill, idx) => (
                  <SkillPill key={`${skill.name}-${idx}`} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-dark relative w-full py-32 px-4 overflow-hidden">
        <div className="cta-glow" aria-hidden="true" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium tracking-wide text-slate-300">
              Open to new opportunities
            </span>
          </motion.div>

          <RevealHeading
            text="Let's build something together."
            className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-[1.1]"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg text-slate-400 mb-12 max-w-xl mx-auto"
          >
            Have an idea, a role, or a project in mind? I'd love to hear about it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-5 justify-center items-center"
          >
            <Magnetic>
              <Link
                to="/contact"
                className="btn-shine inline-block px-9 py-4 rounded-full font-semibold text-[#0a0a0c] bg-cyan-400 hover:bg-cyan-300 transition shadow-lg shadow-cyan-500/25"
              >
                Get in Touch
              </Link>
            </Magnetic>

            <Magnetic>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-9 py-4 rounded-full font-semibold text-slate-200 border border-white/20 hover:bg-white/5 hover:border-white/40 transition"
              >
                Download Resume
              </a>
            </Magnetic>
          </motion.div>

          {/* Direct contact fallback */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm"
          >
            <a
              href="mailto:palashmishra47@gmail.com"
              className="text-slate-400 hover:text-cyan-300 transition"
            >
              palashmishra47@gmail.com
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition"
            >
              LinkedIn
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;