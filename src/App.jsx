import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Sign_in from './Pages/Sign_in'
import Profile from './Pages/Profile'
import Header from './Components/Header'
import Signup from './Pages/Signup'
import Private from './Components/Private'
import AddProperty from './Pages/AddProperty'
import Listadded from './Pages/Listadded'
import UpdateItems from './Pages/UpdateItems'
import ShowItems from './Pages/ShowItems'
import Items from './Components/Items'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <>
    <Header/>
     <Routes>
          <Route path='/listadded/:addeditemId' element={<Listadded/>} />
         <Route path='/' element={<Home/>} />
         <Route path='/signin' element={<Sign_in/>} />
         <Route path='/showitems' element={<ShowItems/>} />
         <Route path='/items' element={<Items/>} />
         <Route element={<Private/>} >
         <Route path='/profile' element={<Profile/>} />
         <Route path='/addproperty' element={<AddProperty/>} />
         <Route path='/update/:addeditemId' element={<UpdateItems/>} />
         </Route>
         <Route path='/signup' element={<Signup/>} />

     </Routes>
     <ToastContainer/>
    </>
  )
}

export default App
