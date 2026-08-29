import { oracle, nexgen } from "../assets/images";
import {
    car,
    contact,
    css,
    estate,
    express,
    git,
    github,
    html,
    javascript,
    linkedin,
    mongodb,
    motion,
    mui,
    nextjs,
    nodejs,
    pricewise,
    react,
    redux,
    sass,
    snapgram,
    summiz,
    tailwindcss,
    threads,
    typescript,
    movie,    // ← added
    crypto,   // ← added
} from "../assets/icons";

export const skills = [
    { imageUrl: css, name: "CSS", type: "Frontend" },
    { imageUrl: express, name: "Express", type: "Backend" },
    { imageUrl: git, name: "Git", type: "Version Control" },
    { imageUrl: github, name: "GitHub", type: "Version Control" },
    { imageUrl: html, name: "HTML", type: "Frontend" },
    { imageUrl: javascript, name: "JavaScript", type: "Frontend" },
    { imageUrl: mongodb, name: "MongoDB", type: "Database" },
    { imageUrl: motion, name: "Motion", type: "Animation" },
    { imageUrl: mui, name: "Material-UI", type: "Frontend" },
    { imageUrl: nextjs, name: "Next.js", type: "Frontend" },
    { imageUrl: nodejs, name: "Node.js", type: "Backend" },
    { imageUrl: react, name: "React", type: "Frontend" },
    { imageUrl: redux, name: "Redux", type: "State Management" },
    { imageUrl: sass, name: "Sass", type: "Frontend" },
    { imageUrl: tailwindcss, name: "Tailwind CSS", type: "Frontend" },
    { imageUrl: typescript, name: "TypeScript", type: "Frontend" },
];

export const experiences = [
  {
    title: "Software Developer 2",
    company_name: "Oracle",
    icon: oracle,
    iconBg: "#e6f0ff",
    date: "Sept 2023 - June 2025",
    points: [
      "Designed and developed scalable SaaS-based backend systems using Java and Spring Boot.",
      "Led development of modular REST APIs supporting high-volume enterprise applications.",
      "Applied clean architecture principles (Controller-Service-Repository) to ensure maintainability and scalability.",
      "Optimized SQL queries, improving performance of reporting and transactional systems.",
      "Collaborated with distributed teams in Agile setup, contributing to sprint planning, code reviews, and delivery.",
      "Refactored legacy systems to enhance scalability, performance, and code quality.",
    ],
  },
  {
    title: "Backend Developer",
    company_name: "Nexgen Technologies",
    icon: nexgen,
    iconBg: "#d1fae5",
    date: "Oct 2025 - Feb 2026",
    points: [
      "Built and enhanced RESTful APIs using Java 8 and Spring Boot for scalable backend services.",
      "Implemented authentication and authorization mechanisms to improve application security.",
      "Debugged and resolved production issues, ensuring high availability and reliability.",
      "Worked closely with frontend teams to support client-side integrations and performance optimization.",
    ],
  },
];

export const socialLinks = [
    {
        name: 'Contact',
        iconUrl: contact,
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/YourGitHubUsername',
    },
    {
        name: 'LinkedIn',
        iconUrl: linkedin,
        link: 'https://www.linkedin.com/in/YourLinkedInUsername',
    },
];

export const projects = [
  {
    iconUrl: movie,
    theme: "bg-gradient-to-r from-blue-500 to-cyan-500",
    name: "Movie Fetcher",
    description:
      "Built a scalable backend using Java, Spring Boot, REST APIs, and SQL. Implemented validation, exception handling, and optimized queries with filtering and sorting for high performance.",
    tags: ["Java", "Spring Boot", "REST API", "SQL"],
    // Drop a screenshot in src/assets/images and import it here
    image: null,
    link: "https://your-live-link.com",
  },
  {
    iconUrl: crypto,
    theme: "bg-gradient-to-r from-purple-500 to-pink-500",
    name: "Crypto-X",
    description:
      "Developed a dynamic frontend with real-time API integration for crypto data visualization. Built reusable UI components with responsive design and optimized client-side performance.",
    tags: ["React", "REST API", "Charts", "Tailwind"],
    image: null,
    link: "https://your-live-link.com",
  },
  {
    iconUrl: threads,
    theme: "bg-gradient-to-r from-orange-400 to-red-500",
    name: "Threads Clone",
    description:
      "Full-stack social media app with real-time messaging and authentication. Built on MongoDB with JWT auth and socket.io for live updates.",
    tags: ["React", "Node.js", "MongoDB", "Socket.io"],
    image: null,
    link: "https://your-live-link.com",
  },
  {
    iconUrl: snapgram,
    theme: "bg-gradient-to-r from-green-400 to-blue-500",
    name: "Snapgram",
    description:
      "Instagram-inspired app with image upload, infinite scroll, user profiles, and likes/comments system. Built with React, Firebase, and Tailwind CSS for a modern mobile-first experience.",
    tags: ["React", "Firebase", "Tailwind"],
    image: null,
    link: "https://your-live-link.com",
  },
  {
    iconUrl: summiz,
    theme: "bg-gradient-to-r from-yellow-400 to-orange-500",
    name: "AI Summarizer",
    description:
      "AI-powered article summarizer using OpenAI API. Features include URL input, saved summaries, responsive design, and seamless integration with external APIs for intelligent content extraction.",
    tags: ["React", "OpenAI API", "Redux"],
    image: null,
    link: "https://your-live-link.com",
  },
  {
    iconUrl: pricewise,
    theme: "bg-gradient-to-r from-indigo-500 to-purple-600",
    name: "PriceWise",
    description:
      "E-commerce price tracking application with web scraping, real-time price monitoring, and email notifications. Built with Node.js backend and React frontend for optimal user experience.",
    tags: ["Next.js", "Node.js", "MongoDB", "Cheerio"],
    image: null,
    link: "https://your-live-link.com",
  },
];