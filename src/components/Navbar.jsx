import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4">
      
      {/* Logo */}
      <NavLink
        to="/"
        className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold shadow-md"
      >
        <p className="blue-gradient_text">PM</p>
      </NavLink>

      {/* Navigation */}
      <nav className="flex text-lg gap-7 font-medium">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'text-blue-500' : 'text-white'
          }
        >
          About
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive ? 'text-blue-500' : 'text-white'
          }
        >
          Projects
        </NavLink>
      </nav>

    </header>
  )
}

export default Navbar