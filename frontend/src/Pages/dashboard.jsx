import { useContext, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { GlobalContext } from '../Contexts/GlobalContext';

import "../utils/dashboard.css"

const DashboardPage = ()=>{
    const {user,setPayload,payload}= useContext(GlobalContext)
    console.log(user)

      const getInfo = async(user)=>{

        const options = {
          method:"POST",
          headers: {
            Authorization:`Bearer ${user.access_token}`,
              'Content-Type': 'application/json'
            },
          body: JSON.stringify(user)
        }
        console.log(user,"esdfsdfsd")
        try{
          let info = await fetch("api/v1/products",options)
          info = await info.json()
          setPayload(info.products)
          console.log(info.products)

        }catch(e){
          console.error("No data",e)
        }
        
      }
     
      const allInfo = payload.map(info=>{
        return<tr key={info.id}>
        <td>{info.id}</td>
        <td>{info.name}</td>
        <td>{info.description}</td>
        <td>{info.price}</td>
      </tr>
      })

     
    return <div>
      <header className='header'>
        <h1>Hello again {user.user.username}!</h1>
        <input type="button" value = "get data" onClick={()=>getInfo(user)} />
      </header>
<div className='dash-table'>
<Table striped bordered hover width="90%" className='dash-table'>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {allInfo}
      </tbody>
    </Table>
    </div>
    </div>
}

export default DashboardPage