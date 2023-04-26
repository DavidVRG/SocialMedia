import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './context/AuthContext';
import { AuthStatus } from './components/auth/AuthStatus'
import ProtectedRoute from './components/auth/ProtectedRoute';
import { GetChats } from './components/utils/GetChats';

// Pages
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import { GetNotifications } from './components/utils/GetNotifications';

function App() {

  // Get the userData from AuthStatus
  const { userData } = AuthStatus()

  // Get Chats
  const { chats, newMessage } = GetChats()

  // Get Notifications
  const { notifications, newNotification } = GetNotifications()

  // Set current chat
  const [currentChat, setCurrentChat] = useState(null)

  // Set the basic userData
  const [user, setUser] = useState({
    name: "",
    photoURL: "./profile.png"
  })
  const { name, photoURL } = user

  // Set the userData from AuthStatus
  useEffect(() => {
    setUser({
      name: userData.name,
      photoURL: userData.photoURL !== null ? userData.photoURL : "./profile.png"
    })
  }, [userData])

  return (
    <AuthContext.Provider value={{ name: name, photoURL: photoURL, currentChat: currentChat, chats: chats, newMessage: newMessage, newNotification: newNotification, notifications: notifications }}>
      <div className="App">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Routes>
          <Route path='/' element={<ProtectedRoute />}>
            <Route path="/" element={<Home setUser={setUser} setCurrentChat={setCurrentChat} />} />
          </Route>
          <Route path='/sign-in' element={<SignIn setUser={setUser} />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  )
}

export default App