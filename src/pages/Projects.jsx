import { arrow } from "../assets/icons";
import { projects } from "../constants";
import { Link } from "react-router-dom";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const Projects = () => {
  return (
    <>
    <section className="max-container">

      {/* Heading */}
      <h1 className="head-text">
        My{" "}
        <span className="blue-gradient_text font-semibold drop-shadow">
          Projects
        </span>
      </h1>

      {/* Description */}
      <div className="mt-5 flex flex-col gap-3 text-slate-500">
        <p>
          I've embarked on numerous projects throughout the years, but these are
          the ones I hold closest to my heart. Many of them are open-source, so
          if you come across something that piques your interest, feel free to
          explore the codebase and contribute your ideas for further
          enhancements. Your collaboration is highly valued!
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap my-20 gap-10">
        {projects.map((project) => (
          <div className="w-[160px]" key={project.name}>

            {/* Square Icon Card */}
            <div className="block-container rounded-xl h-[120px]">
              <div className="btn-back rounded-xl" />
              <div className="btn-front rounded-xl">
                <img
                  src={project.iconUrl}
                  alt={project.name}
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
            </div>

            {/* Text Below Card */}
            <div className="mt-4 flex flex-col">
              <h4
                className="text-base font-semibold leading-snug line-clamp-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {project.name}
              </h4>
              <p className="mt-2 text-slate-500 text-sm line-clamp-3">
                {project.description}
              </p>
              <div className="mt-3 flex items-center gap-1">
                <img
                  src={arrow}
                  alt="arrow"
                  className="w-4 h-4 object-contain"
                />
              </div>
            </div>

          </div>
        ))}
      </div>

      <hr className="border-slate-200" />
      <CTA />

    </section>
    <Footer />
    </>
  );
};

export default Projects;