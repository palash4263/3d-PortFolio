import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";

import Loader from "../components/Loader";
import { Island } from "../models/Island";
import Sky from "../models/Sky";
import Bird from "../models/Bird";
import Plane from "../models/Plane";
import HomeInfo from "../components/HomeInfo";
import Footer from "../components/Footer";

import sakura from "../assets/sakura.mp3";
import { soundoff, soundon } from "../assets/icons";

const Home = () => {
  const audioRef = useRef(new Audio(sakura));

  const [isRotating, setIsRotating] = useState(false);
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

  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [1, 1, 1];
      screenPosition = [5, 4, -15];
    } else {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [8, 5, -20];
    }

    return [screenScale, screenPosition];
  };

  const adjustIslandForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -6.5, -43.4];
    } else {
      screenScale = [1.3, 1.3, 1.3];
      screenPosition = [0, -6.5, -43.4];
    }

    return [screenScale, screenPosition];
  };

  const [planeScale, planePosition] = adjustBiplaneForScreenSize();
  const [islandScale, islandPosition] = adjustIslandForScreenSize();

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section with Canvas */}
      <section className="w-full h-screen relative">
        {/* Info UI */}
        <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
          {currentStage && <HomeInfo currentStage={currentStage} />}
        </div>

        <Canvas
          className={`w-full h-screen bg-transparent ${
            isRotating ? "cursor-grabbing" : "cursor-grab"
          }`}
          camera={{ near: 0.1, far: 1000, position: [0, 0, 20] }}
        >
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[1, 1, 1]} intensity={2} />
            <hemisphereLight
              skyColor="#b1e1ff"
              groundColor="#000000"
              intensity={1}
            />

            <Bird />
            <Sky isRotating={isRotating} />

            <Island
              position={islandPosition}
              scale={islandScale}
              isRotating={isRotating}
              setIsRotating={setIsRotating}
              setCurrentStage={setCurrentStage}
            />
          </Suspense>
        </Canvas>

        {/* ⌨️ Keyboard Instructions */}
        <div className="controls-box">
          <p className="controls-title">Controls</p>
          <div className="controls-row">
            <kbd>←</kbd>
            <span>Rotate left</span>
          </div>
          <div className="controls-row">
            <kbd>→</kbd>
            <span>Rotate right</span>
          </div>
          <div className="controls-row">
            <span>🖱️</span>
            <span>Drag to explore</span>
          </div>
        </div>

        {/* 🎵 Music Toggle */}
        <div className="absolute bottom-2 left-2">
          <img
            src={!isPlayingMusic ? soundoff : soundon}
            alt="music"
            onClick={() => setIsPlayingMusic((prev) => !prev)}
            className="w-10 h-10 cursor-pointer object-contain"
          />
        </div>
      </section>

      {/* Scroll Down Indicator */}
      <motion.div
        className="flex justify-center py-4 bg-gradient-to-b from-blue-50 to-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>

      {/* Featured Section */}
      <section className="w-full min-h-screen bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              <span className="blue-gradient_text">Featured Highlights</span>
            </h2>
            <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
              Explore my journey from code to creation. Each project represents a chapter of learning, growth, and innovation.
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "Fast & Responsive",
                description: "Built with React, Three.js, and modern web technologies for optimal performance"
              },
              {
                icon: "✨",
                title: "Interactive 3D",
                description: "Explore dynamic 3D models and immersive user experiences"
              },
              {
                icon: "🎨",
                title: "Beautiful Design",
                description: "Crafted with Tailwind CSS and attention to visual excellence"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: false, amount: 0.2 }}
                className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100 hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full min-h-screen bg-gradient-to-r from-blue-600 to-cyan-500 py-20 px-4 flex items-center">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            <h2 className="text-5xl font-bold mb-6">Let's Build Something Amazing</h2>
            <p className="text-xl mb-8 opacity-90">
              Have an idea? Let's collaborate and bring it to life with cutting-edge technology.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:shadow-xl transition"
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;