import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import LoginPage from './Pages/login'
import DashboardPage from './Pages/dashboard'
import { GlobalContext, GlobalContextProvider } from './Contexts/GlobalContext'

function App() {
  const{
      isLogIn, 
  } = useContext(GlobalContext)


  return(
    <>
      {!isLogIn? <LoginPage/> : <DashboardPage/>}
    </>
  
  )
}

export default App
