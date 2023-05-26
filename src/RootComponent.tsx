import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Router } from './routes'
import { RouterBeforeEach } from "./utility/useUtilsNavigate";

import './styles/main.sass'

RouterBeforeEach((to, from) => { 
  const token = localStorage.getItem('token')
  if (to?.needAuth && !token) {
    return false;
  }
  return true;
})

const RootComponent: React.FC = () => {
    return (
        <RouterProvider router={Router()}/>
    )
}

export default RootComponent
