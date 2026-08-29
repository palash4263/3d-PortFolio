import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section-dark border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 relative z-1">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <h3 className="hero-gradient-text text-lg font-bold">
              Palash
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Software Engineer crafting beautiful digital experiences
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm tracking-wide uppercase opacity-70">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-slate-400 hover:text-cyan-300 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-slate-400 hover:text-cyan-300 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">About</span>
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm text-slate-400 hover:text-cyan-300 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Projects</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-slate-400 hover:text-cyan-300 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm tracking-wide uppercase opacity-70">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-cyan-300 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">GitHub</span>
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-cyan-300 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">LinkedIn</span>
                </a>
              </li>
              
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          {/* Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © {currentYear} Palash. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Built with React, Three.js & Tailwind CSS ·{" "}
              <a
                href="https://poly.pizza/m/4U4lI91VbsO"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                &ldquo;Computer desk&rdquo; by Poly by Google (CC-BY)
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
