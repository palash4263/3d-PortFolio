import React, { Suspense, useState } from 'react'
import { useRef } from 'react'
import emailjs from '@emailjs/browser'
import { Canvas } from '@react-three/fiber'
import Fox from '../models/Fox'
import Loader from '../components/Loader'
import Alert from '../components/Alert'
import Footer from '../components/Footer'
import useAlert from '../hooks/useAlert'
const Contact = () => {
 const formRef = useRef(null)
 const[form,setForm] =  useState({name:'',email:'',message:''})
 const [isLoading,setIsLoading] = useState(false)
 const [currentAnimations,setCurrentAnimations] = useState('idle')
 const { alert, showAlert, hideAlert } = useAlert();

 const handleChange = (e) =>{ 
    setForm({...form,[e.target.name]:e.target.value})
 }

 const handleFocus = () => setCurrentAnimations('hit')

 const handleBlur = () => setCurrentAnimations('idle')

 const handleSubmit = (e) =>{
  e.preventDefault();
  setIsLoading(true);
  setCurrentAnimations('run')
  emailjs.send(
  import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
  {
    from_name: form.name,
    to_name: "palash",
    reply_to: form.email,
    message: form.message,
  },
  import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
  ).then(()=>{
    setIsLoading(false);
    showAlert({show:true,text:'Message sent successfully',type:"Success"})
    setTimeout(()=> {
      hideAlert();
      setCurrentAnimations('idle')
      setForm({name:'',email:'',message:''})
    },3000)
  }).catch((error)=>{
    setIsLoading(false)
    setCurrentAnimations('idle')
    console.log(error);
    showAlert({show:true,text:'I didnt receive your message',type:"danger"})

  })
 }
  

  return (
    <>
    <section className="relative flex lg:flex-row flex-col max-container">
      {alert.show && <Alert {...alert} />}
      <div className="flex-1 min-w-[50%] flex flex-col">
        <h1 className="head-text">Get In Touch</h1>
        <form className='w-full flex flex-col gap-7 mt-14' 
         onSubmit={handleSubmit}>
          {/* Name input — fix type and name */}
<label className='text-black-500 font-semibold'>
  Name
  <input
    type="text"         
    name='name'         
    className='input'
    placeholder='John'
    required
    value={form.name}
    onChange={handleChange}
    onFocus={handleFocus}
    onBlur={handleBlur}
  />
</label>

{/* Email input — fix name */}
<label className='text-black-500 font-semibold'>
  Email
  <input
    type="email"        
    name='email'        
    className='input'
    placeholder='john@example.com'
    required
    value={form.email}
    onChange={handleChange}
    onFocus={handleFocus}
    onBlur={handleBlur}
  />
</label>

           <label htmlFor="" className='text-black-500 font-semibold'>
           Your Message
           <textarea type="text" name='message' className='textarea' placeholder='Let me know howI can help you!' required
           value={form.message}
            rows={4}
           onChange={handleChange}
           onFocus={handleFocus}
           onBlur={handleBlur}/>
          </label>
          <button
          type="submit"
          className="btn"
          onFocus={handleFocus}
          onBlur={handleBlur}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
      <div className="lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]">
       <Canvas
       camera={{
        position:[0,0,5],
        fov:75,
        near:0.1,
        far:1000
       }}
       >
        <directionalLight intensity={2.5} position={[0,0,1]} />
        <ambientLight intensity={0.5} />
        <Suspense fallback={<Loader />}>
          <Fox
          currentAnimation={currentAnimations}
          position={[0.5,0.35,0]} 
          rotation={[12.6,-0.6,0]}
          scale={[0.5,0.5,0.5]}
           />
        </Suspense>
       </Canvas>
      </div>
    </section>
    <Footer />
    </>
  )
}

export default Contact
