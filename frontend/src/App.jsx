import React from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import EmailVerificationPage from './pages/EmailVerificationPage'
import CarListingPage from './pages/CarListingPage'
import CarDetailsPage from './pages/CarDetailsPage'
import CreateCarPage from './pages/CreateCarPage'
import EditCarPage from './pages/EditCarPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { Toaster } from 'react-hot-toast'


const App = () => {
  return (
    <div className=''>
     <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/signup' element={<SignupPage/>} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/forgot-password' element={<ForgotPasswordPage/>} />
      <Route path='/reset-password/:token' element={<ResetPasswordPage/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/verify-email' element={<EmailVerificationPage/>}  />
      <Route path='/cars' element={<CarListingPage/>} />
      <Route path='/cars/create' element={<CreateCarPage/>} />
      <Route path='/cars/:id' element={<CarDetailsPage/>} />
      <Route path='/cars/:id/edit' element={<EditCarPage/>} />
     </Routes>
     <Toaster/>
    </div>
  )
}

export default App