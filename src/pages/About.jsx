import React from 'react'
import { skills,experiences } from '../constants'
import TiltCard from '../components/TiltCard'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import CTA from '../components/CTA.jsx';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const AnimatedExperienceItem = ({ experience, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <VerticalTimelineElement
        key={experience.company_name}
        date={experience.date}
        position={index === 1 ? "right" : "left"}
        icon={
          <div className="flex justify-center items-center w-full h-full">
            <img
              src={experience.icon}
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        }
        contentStyle={{
          borderBottom: '8px solid',
          borderBottomColor: experience.iconBg,
          boxShadow: 'none',
        }}
        iconStyle={{ background: experience.iconBg }}
      >
        <div>
          <h3 className="text-black text-xl font-poppins font-semibold">
            {experience.title}
          </h3>
          <p className="text-black-500 font-medium font-base" style={{ margin: 0 }}>
            {experience.company_name}
          </p>
        </div>
        <ul className="my-5 list-disc ml-5 space-y-2">
          {experience.points.map((point, index) => (
            <li
              key={`experience-point-${index}`}
              className="text-black-500/50 font-normal pl-1 text-sm"
            >
              {point}
            </li>
          ))}
        </ul>
      </VerticalTimelineElement>
    </motion.div>
  );
};

const About = () => {
  return (
    <>
      <section className="max-container">
         <h1 className="head-text">
          Hello, I'm <span className="blue-gradient_text font-semibold drop-shadow">Palash</span>
         </h1>
         <div className='mt-5 flex flex-col gap-3 text-slate-500'>
        <p>
          Software Engineer based in India, specializing in technical
          education through hands-on learning and building applications.
        </p>
      </div>
         <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
  {skills.map((skill, index) => (
    <motion.div
      key={skill.name}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
      viewport={{ once: false, amount: 0.2 }}
    >
      <TiltCard>
        <div
          className="group relative w-24 h-24 sm:w-28 sm:h-28 
          bg-white/10 backdrop-blur-md border border-white/10 
          rounded-xl flex flex-col items-center justify-center 
          shadow-md transition-all duration-300 
          hover:shadow-blue-400/30 cursor-pointer"
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
          bg-gradient-to-r from-blue-500/20 to-cyan-400/20 blur-lg transition duration-300" />

          {/* Icon */}
          <img
            src={skill.imageUrl}
            alt={skill.name}
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain z-10 
            transition-transform duration-300 group-hover:scale-110"
          />

          {/* Label */}
          <p className="mt-2 text-[11px] sm:text-xs text-slate-300 z-10">
            {skill.name}
          </p>
        </div>
      </TiltCard>
    </motion.div>
  ))}
</div>
   <div className="py-16">
  <h3 className="subhead-text mt-25">Work Experience</h3>
    <div className='mt-5 flex flex-col gap-3 text-slate-500'>
        <p>I've worked with all sorts of companies,leveling up my skills and teaming up with smart people.
           Here's the rundown:</p>
      </div>
      <motion.div 
        className="mt-12 flex"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
      >
       <VerticalTimeline lineColor="#e2e8f0">
  {experiences.map((experience, index) => (
    <AnimatedExperienceItem 
      key={experience.company_name} 
      experience={experience}
      index={index}
    />
  ))}
</VerticalTimeline>
      </motion.div>
    </div>
    <hr className="border-slate-200"/>
    <CTA />
      </section>
      <Footer />
    </>
  )
}

export default About
