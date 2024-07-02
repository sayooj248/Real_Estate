import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
function Header() {

    const {currentUser}=useSelector((state)=>state.user)
    return (
        <>
            <header className='bg-gray-500 shadow-md'>
                <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap '>
                        <Link to='/'>
                        <i className="fa-solid fa-globe fa-xl" style={{color:' #5d098b'}}></i>
                        <span className='text-red-800 p-1 text-3xl '>QuickSell</span>
                        <span className='text-black'>Realestate</span>
                        </Link>
                    </h1>
                    <ul className='flex gap-5 '>
                      <Link to='/'>  <li className=' text-black hover:underline mt-1'>Home</li></Link>
                      <Link to='showitems'>  <li className=' text-black hover:underline mt-1'>Property</li></Link>
                      <Link to='profile'>
                        {
                            currentUser ?(
                               <img className=' flex rounded-full h-9 w-9 object-cover' src={currentUser.avatar} alt="Profile" />
                            ):(
                                <li className=' text-black hover:underline mt-1'>Sign In</li>
                            )
                        }
                        </Link> 
                    </ul>
                </div>
            </header>
        </>
    )
}

export default Header