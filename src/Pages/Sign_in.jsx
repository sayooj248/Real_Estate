import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../Redux/UserSlice';
import { toast } from 'react-toastify';


function Sign_in() {

  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleChange = (e) => { setFormData({ ...formData, [e.target.id]: e.target.value }) };
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        disabled(signInFailure(data.message))
        toast.warning("invild password/email")
        return;
      }
      dispatch(signInSuccess(data))
       toast.success("login successfully")
      navigate('/');
    } catch (error) {
      disabled(signInFailure(error.message))
    }
  };
  return (
    
    <div className='bg-slate-700 ' style={{ height: "100vh" }}  >
      <div className='p-3 py-20 max-w-lg mx-auto '>

        <div className='border bg-white p-10 rounded-lg  bg-blend-saturation'>

          <h1 className='text-3xl text-center font-semibold my-8'>Sign In</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
            <input type='email' placeholder='email' className='border border-blue-800 p-3 rounded-lg ' id='email' onChange={handleChange} />
            <input type='password' placeholder='password' className='border  border-blue-800 p-3 rounded-lg' id='password' onChange={handleChange} />

            <button  className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >
             Sign in
            </button>
          </form>
          <div className='flex gap-2 mt-5'>
            <p> Dont Have an account?</p>
            <Link to={'/signup'}>
              <span className='text-red-800'>Sign Up</span>
            </Link>
          </div>
          {error && <p className='text-red-500 mt-5'>{error}</p>}

        </div>

      </div>
    </div>

  )
}

export default Sign_in