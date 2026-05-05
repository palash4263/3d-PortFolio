import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Palash
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Software Engineer crafting beautiful digital experiences
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-sm tracking-wide uppercase opacity-70">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-slate-600 hover:text-blue-600 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-slate-600 hover:text-blue-600 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">About</span>
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm text-slate-600 hover:text-blue-600 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Projects</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-slate-600 hover:text-blue-600 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-sm tracking-wide uppercase opacity-70">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-blue-600 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">GitHub</span>
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-blue-600 transition duration-200 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">LinkedIn</span>
                </a>
              </li>
              
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-6">
          {/* Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © {currentYear} Palash. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-slate-500 hover:text-blue-600 transition duration-200 hover:font-medium">
                Privacy Policy
              </a>
              <span className="text-slate-300">•</span>
              <a href="#" className="text-xs text-slate-500 hover:text-blue-600 transition duration-200 hover:font-medium">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
