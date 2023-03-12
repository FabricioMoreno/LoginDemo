import { useContext } from "react"
import { GlobalContext } from "../Contexts/GlobalContext"

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

/* import "../index.css"
import "../App.css" */

import "../utils/login.css"


const LoginPage = ()=>{
    const {username,
      setUsername,
      password,
      setPassword,
      setisLogIn,
      setUser
    } = useContext(GlobalContext)

    const loginUser = async(username,password)=>{
      const options = {
          method:"POST",
          headers: {
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({
            username: username,
            password: password
        })
      }

      console.log(JSON.stringify({
        username,
        password

    }))

      try{
          let info = await fetch("api/v1/auth/login",options)
          info = await info.json()

          if(!info.access_token){
            throw new Error("Failed")
          }
          
          localStorage.setItem("access_token",info.access_token)
          setUser(info)
          setisLogIn(true)
          
      }catch(e){
        setisLogIn(false)
        console.log("sdfsd")
        const MySwal = withReactContent(Swal)

        MySwal.fire({
          title: <strong>Credentials not valid</strong>,
          icon: 'error'
        })
        

      }
  }


  const registerUser = async(username,password)=>{
    const options = {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          username: username,
          password: password
      })
    }

    console.log(JSON.stringify({
      username,
      password

  }))

    try{
        let info = await fetch("api/v1/auth/register",options)
        info = await info.json()

        console.log(info.access_token,"sdfsdf")
        if(info.status !== 200){
          throw new Error("Failed")
        }
        
        localStorage.setItem("access_token",info.access_token)
        setUser(info)
        setisLogIn(true)
        
    }catch(e){
      setisLogIn(false)

      const MySwal = withReactContent(Swal)

      MySwal.fire({
        title: <strong>Sign up failed</strong>,
        icon: 'error'
      })
      

    }
}

    return (
        <div className="form">
     <form>
       <div className="input-login">
         <label htmlFor="username">Username </label>
         <input type="text" id="username" required onChange={e=>setUsername(e.target.value)}/>
       </div>
       <div className="input-login">
         <label>Password </label>
         <input type="password" id="password" required onChange={e=>setPassword(e.target.value)}/>
       </div>
       <div className="button-login">
         <input type="button" value="Log in" onClick={(e)=>{
          e.preventDefault()
          loginUser(username,password)}}/>
       </div>
       <div className="button-login">
         <input type="button" value="Sign up" onClick={(e)=>{
          e.preventDefault()
          registerUser(username,password)}}/>
       </div>
     </form>
    </div>
    )
}

export default LoginPage