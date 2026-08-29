import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/10">

      {/* Logo */}
      <NavLink
        to="/"
        className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-purple-500 flex items-center justify-center font-bold shadow-md shadow-fuchsia-500/30"
      >
        <p className="text-white">PM</p>
      </NavLink>

      {/* Navigation */}
      <nav className="flex text-lg gap-7 font-medium">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `transition-colors ${isActive ? 'text-cyan-300' : 'text-white/90 hover:text-cyan-300'}`
          }
        >
          About
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `transition-colors ${isActive ? 'text-cyan-300' : 'text-white/90 hover:text-cyan-300'}`
          }
        >
          Projects
        </NavLink>
      </nav>

    </header>
  )
}

export default Navbar