import React, { Suspense, useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'

import Fox from '../models/Fox'
import Loader from '../components/Loader'
import Alert from '../components/Alert'
import Footer from '../components/Footer'
import useAlert from '../hooks/useAlert'

const fieldClass =
  'w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:bg-white/[0.07]'

/* Gradient stops the headline interpolates across, letter by letter */
const GRADIENT = [
  [34, 211, 238], // cyan-400
  [168, 85, 247], // purple-500
  [244, 114, 182], // pink-400
]

// Sample the gradient at t (0..1) so each character gets its own colour
const colorAt = (t) => {
  const scaled = t * (GRADIENT.length - 1)
  const i = Math.min(Math.floor(scaled), GRADIENT.length - 2)
  const f = scaled - i
  const [a, b] = [GRADIENT[i], GRADIENT[i + 1]]
  const rgb = a.map((v, k) => Math.round(v + (b[k] - v) * f))
  return `rgb(${rgb.join(', ')})`
}

/* 🔷 Headline that reveals character-by-character and reacts to hover */
const AnimatedHeading = ({ text, className = '' }) => {
  const chars = [...text]

  return (
    <h1
      className={className}
      aria-label={text}
      style={{ perspective: 800 }}
    >
      {chars.map((char, i) => {
        // Spaces still need to occupy width, but shouldn't animate
        if (char === ' ') return <span key={i}>&nbsp;</span>

        return (
          <motion.span
            key={i}
            aria-hidden="true"
            className="inline-block will-change-transform"
            style={{ color: colorAt(i / Math.max(chars.length - 1, 1)) }}
            initial={{ opacity: 0, y: 80, rotateX: -90, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            transition={{
              delay: 0.15 + i * 0.045,
              type: 'spring',
              stiffness: 140,
              damping: 14,
            }}
            whileHover={{
              y: -14,
              scale: 1.18,
              color: '#ffffff',
              textShadow: '0 0 24px rgba(34,211,238,0.85)',
              transition: { type: 'spring', stiffness: 400, damping: 12 },
            }}
          >
            {char}
          </motion.span>
        )
      })}
    </h1>
  )
}

const Contact = () => {
  const formRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [currentAnimations, setCurrentAnimations] = useState('idle')
  const { alert, showAlert, hideAlert } = useAlert()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFocus = () => setCurrentAnimations('hit')

  const handleBlur = () => setCurrentAnimations('idle')

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setCurrentAnimations('run')
    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: 'palash',
          reply_to: form.email,
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setIsLoading(false)
        showAlert({
          show: true,
          text: 'Message sent successfully',
          type: 'Success',
        })
        setTimeout(() => {
          hideAlert()
          setCurrentAnimations('idle')
          setForm({ name: '', email: '', message: '' })
        }, 3000)
      })
      .catch((error) => {
        setIsLoading(false)
        setCurrentAnimations('idle')
        console.log(error)
        showAlert({
          show: true,
          text: 'I didnt receive your message',
          type: 'danger',
        })
      })
  }

  return (
    <>
      <section className="section-dark min-h-screen w-full px-6 pt-28 pb-24">
        {alert.show && <Alert {...alert} />}

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.25em] uppercase text-cyan-400 mb-4"
          >
            Contact
          </motion.p>

          <AnimatedHeading
            text="Get in touch."
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 cursor-default"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-400 max-w-xl leading-relaxed mb-16"
          >
            Got a role, a project, or just want to say hello? Drop me a message
            and I'll get back to you.
          </motion.p>

          <div className="grid lg:grid-cols-2 gap-14 items-start">
            {/* Form */}
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="w-full flex flex-col gap-6"
            >
              <label className="text-sm font-medium text-slate-300">
                Name
                <input
                  type="text"
                  name="name"
                  className={fieldClass}
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </label>

              <label className="text-sm font-medium text-slate-300">
                Email
                <input
                  type="email"
                  name="email"
                  className={fieldClass}
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </label>

              <label className="text-sm font-medium text-slate-300">
                Your Message
                <textarea
                  name="message"
                  className={`${fieldClass} resize-y`}
                  placeholder="Let me know how I can help you!"
                  required
                  value={form.message}
                  rows={5}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </label>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="mt-2 px-8 py-3.5 rounded-full font-semibold text-[#0a0a0c] bg-cyan-400 hover:bg-cyan-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </motion.button>

              <p className="text-sm text-slate-500">
                Prefer email?{' '}
                <a
                  href="mailto:palashmishra47@gmail.com"
                  className="text-slate-300 hover:text-cyan-300 transition"
                >
                  palashmishra47@gmail.com
                </a>
              </p>
            </motion.form>

            {/* 3D Fox — reacts as you fill the form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="w-full lg:h-[550px] md:h-[450px] h-[320px] rounded-2xl bg-white/[0.02] border border-white/10"
            >
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
                dpr={[1, 1.5]}
              >
                <directionalLight intensity={2.5} position={[0, 0, 1]} />
                <ambientLight intensity={0.8} />
                <pointLight position={[2, 2, 3]} intensity={1.2} color="#22d3ee" />
                <Suspense fallback={<Loader />}>
                  <Fox
                    currentAnimation={currentAnimations}
                    position={[0.5, 0.35, 0]}
                    rotation={[12.6, -0.6, 0]}
                    scale={[0.5, 0.5, 0.5]}
                  />
                </Suspense>
              </Canvas>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Contact
