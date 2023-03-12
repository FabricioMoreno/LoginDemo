import React,{ useState } from "react"


const GlobalContext = React.createContext({})

const GlobalContextProvider = ({children})=>{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [user,setUser] = useState({})
    const [isLogIn, setisLogIn] = useState(false)
    const [payload, setPayload] = useState([])


    const values = {
        username,
        setUsername,
        password,
        setPassword,
        isLogIn, 
        setisLogIn,
        user,
        setUser,payload, setPayload
    }

    return(
        <GlobalContext.Provider value= {values}>
            {children}
        </GlobalContext.Provider>
    )
}

export {GlobalContextProvider,GlobalContext}