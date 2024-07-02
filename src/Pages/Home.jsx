import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
   <>
     <div className='bg-slate-200' style={{height:'90vh'}}>
    <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-black font-bold text-3xl lg:text-6xl'>Find your next <span className='text-red-700'>Dream</span> place 
        </h1>
        <div className='text-black  '>
           <h3 className='text-xl'> This Web Application helps user to register individual home or apartment to assist you in finding the perfect rental home or property.</h3>
              <br />
               We have a wide range of properties for you .......
         </div>
        <Link to={'/showitems'}  >
         <button className='text-white bg-green-700 p-3 rounded-lg'>   Let's started...</button>
        </Link>
      </div>
      </div>
   
   </>
  )
}

export default Home