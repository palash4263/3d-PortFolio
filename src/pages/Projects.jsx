import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";

import { projects } from "../constants";
import Footer from "../components/Footer";

const isRealLink = (link) => link && !link.includes("your-live-link.com");

/* Container that staggers its children into view */
const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 16 },
  },
};

/* 🔷 A single project card with cursor-driven 3D tilt + spotlight */
const ProjectCard = ({ project, onSelect }) => {
  const cardRef = useRef(null);

  // Raw pointer position within the card, normalized to -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Spring-smoothed so the tilt eases instead of snapping
  const sx = useSpring(px, { stiffness: 150, damping: 18 });
  const sy = useSpring(py, { stiffness: 150, damping: 18 });

  const rotateX = useTransform(sy, [-0.5, 0.5], ["9deg", "-9deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-9deg", "9deg"]);

  // Spotlight follows the cursor across the card surface
  const glowX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);
  const spotlight = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(320px circle at ${x} ${y}, rgba(34,211,238,0.15), transparent 70%)`
  );

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(project);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.name}`}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="group relative rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      {/* Cursor spotlight */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: spotlight }}
      />

      {/* Preview */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-white/10">
        {project.image ? (
          <motion.img
            src={project.image}
            alt={`${project.name} screenshot`}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ) : (
          <div
            className={`w-full h-full ${project.theme} flex items-center justify-center`}
          >
            <motion.img
              src={project.iconUrl}
              alt={project.name}
              className="w-12 h-12 object-contain"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        )}
      </div>

      <div className="relative p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          {project.name}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {project.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.06 }}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300 bg-white/5 border border-white/10"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-5">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 group-hover:gap-2 transition-all">
            View details →
          </span>

          {isRealLink(project.link) && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium text-slate-400 hover:text-white transition"
              whileHover={{ x: 3 }}
            >
              Live site ↗
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

/* 🔷 Detail modal — closes on Escape, backdrop click, or the X button */
const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    // Prevent the page behind the modal from scrolling
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#111114] border border-white/10 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 border border-white/15 text-slate-300 hover:text-white hover:bg-black/70 transition flex items-center justify-center"
        >
          ✕
        </button>

        {/* Preview */}
        <div className="aspect-video w-full border-b border-white/10">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.name} screenshot`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full ${project.theme} flex items-center justify-center`}
            >
              <img
                src={project.iconUrl}
                alt=""
                aria-hidden="true"
                className="w-16 h-16 object-contain"
              />
            </div>
          )}
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {project.name}
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {project.description}
          </p>

          {project.tags && (
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-3">
                Built with
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-200 bg-white/5 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {isRealLink(project.link) ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full font-semibold text-[#0a0a0c] bg-cyan-400 hover:bg-cyan-300 transition"
              >
                Visit live site ↗
              </a>
            ) : (
              <span className="px-6 py-2.5 rounded-full text-sm text-slate-500 border border-white/10">
                Live link coming soon
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [selected, setSelected] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const heading = "My Projects".split(" ");

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500 z-50"
      />

      <section className="section-dark min-h-screen w-full px-6 pt-28 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.25em] uppercase text-cyan-400 mb-4"
          >
            Portfolio
          </motion.p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 flex flex-wrap gap-x-4">
            {heading.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.15 + i * 0.12,
                  type: "spring",
                  stiffness: 90,
                  damping: 14,
                }}
                className={i === 1 ? "hero-gradient-text" : "text-white"}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-slate-400 max-w-2xl leading-relaxed mb-16"
          >
            A collection of things I've designed, built and shipped. Many are
            open-source — dig into the code, and tell me what you'd do
            differently.
          </motion.p>

          {/* Grid */}
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.name}
                project={project}
                onSelect={setSelected}
              />
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 text-center border-t border-white/10 pt-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Have a project in mind?
            </h2>
            <p className="text-slate-400 mb-8">
              Let's build something together.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-3 rounded-full font-semibold text-[#0a0a0c] bg-cyan-400 hover:bg-cyan-300 transition"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default Projects;
