import React, { useEffect } from 'react'
import { createContext , useState } from 'react'
import Login from '../screens/Login'
export const userContext = createContext()

export const ContextProvider = ({children}) => {
   const [userData, setuserData] = useState('')
  
   return (
      <userContext.Provider value={{userData , setuserData}}>
         {children}
      </userContext.Provider>
   )
}