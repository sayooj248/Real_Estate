import { current } from '@reduxjs/toolkit'
import React from 'react'
import { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'

function Contact({addeditem}) {
  
    const [landlord,setLandlord]=useState(null)
    const [message,setMessage]=useState('')


    const onchange=(e)=>{
        setMessage(e.target.value)
    }

    useEffect(() => {
        const fetchLandlord = async () => {
          try {
            const res = await fetch(`/api/user/${addeditem.userRef}`)
            const data = await res.json()
            setLandlord(data)
          } catch (error) {
            console.log(error)
          }
        };
        fetchLandlord()
      }, [addeditem.userRef])
  return (
   <>

       {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
          <i className="fa-solid fa-envelope fa-bounce fa-2xl" style={{color:' #15b800'}}></i> 
              Contact <span className='font-semibold text-red-800'>{landlord. username}</span>{' '}
            for{' '} <span className='font-semibold  text-red-800'>{addeditem.name}</span>
          </p>
           <textarea name='message' id='message' rows='2' value={message} onChange={onchange} 
            placeholder='Enter your message here...'  className='w-full border p-3 rounded-lg' ></textarea>

          <Link to={`mailto:${landlord.email}?subject=Regarding ${addeditem.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95' >
            Send Message          
          </Link>
        </div>
      )}
   
   </>
  )
}

export default Contact