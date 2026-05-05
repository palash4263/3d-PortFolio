import React from 'react'
import {Link} from 'react-router-dom'
import {arrow} from '../assets/icons'
 
/* 🔷 Reusable Info Box */
const InfoBox = ({ text, link, btnText }) => {
  return (
    <div className="info-wrapper">
      
      <div className="info-card">
        {text}

        {link && (
          <Link to={link} className="info-cta">
            {btnText}
            <img src={arrow} alt="arrow" />
          </Link>
        )}
      </div>

    </div>
  )
}

/* 🔷 Dynamic Content based on Stage */
const renderContent = {
  1: (
    <InfoBox
      text={
        <div className="flex flex-col items-center">
          <p className="sm:text-lg text-center font-medium text-white">
            Hi, I am <span className="font-semibold">Palash 👋</span><br />
            A Software Engineer from India
          </p>
        </div>
      }
      link="/about"
      btnText="Learn more"
    />
  ),

  2: (
    <InfoBox
      text={
        <p className="sm:text-lg text-center font-medium text-white">
          Explore my projects 🚀
        </p>
      }
      link="/projects"
      btnText="View Projects"
    />
  ),

  3: (
    <InfoBox
      text={
        <p className="sm:text-lg text-center font-medium text-white max-w-md">
          Need a project done or looking for a dev?
        </p>
      }
      link="/contact"
      btnText="Lets talk"
    />
  )
}
/* 🔷 Main Component */
const HomeInfo = ({ currentStage }) => {
  return renderContent[currentStage] || null
}

export default HomeInfo