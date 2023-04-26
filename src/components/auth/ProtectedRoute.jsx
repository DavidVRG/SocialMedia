import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Loading from '../utils/Loading'
import { AuthStatus } from './AuthStatus'

// This component will enable the homepage or disable the homepage if the user logged in or not.
export default function ProtectedRoute() {

    // Import loggedIn and checkingStatus from AuthStatus
    const { loggedIn, checkingStatus } = AuthStatus()

    // If the checkingstatus true then the app show the loading component
    if(checkingStatus) {
        return <Loading />
    }

    return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />
}