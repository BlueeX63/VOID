import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { ContextProvider } from './context/UserContext'
const App = () => {
  return (
    <ContextProvider>
      <AppRoutes></AppRoutes>
    </ContextProvider>
  )
}

export default App