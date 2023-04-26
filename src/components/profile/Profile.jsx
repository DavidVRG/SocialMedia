import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UpdateProfilePicture from './UpdateProfilePicture';
import UpdateProfile from './UpdateProfile';

// Desktop and mobile profile page component
export default function Profile({ setComponents, components, setUser }) {

  // Ref for outsideclick
  const ref = useRef()

  // If the user click to the Change Profile Picture button then the app will show the UpdateProfilePicture component
  const [showUpdateProfilePicture, setShowUpdateProfilePicture] = useState(false)

  // If the user click to the Profile Settings button then the app will show the UpdateProfile component
  const [showUpdateProfile, setShowUpdateProfile] = useState(false)

  // Provider in the app.jsx
  const { name, photoURL } = useContext(AuthContext)

  const auth = getAuth()
  const navigate = useNavigate()

  // If the user click outside then the currrent component set to hidden
  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the previous comments is open and the clicked target is not within the previous comments,
      // then close the previous comments
      if ((showUpdateProfilePicture !== false || showUpdateProfile !== false) && ref.current && !ref.current.contains(e.target)) {
        setShowUpdateProfilePicture(false)
        setShowUpdateProfile(false)
      }
    }

    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [showUpdateProfilePicture, showUpdateProfile])

  // If the user click to the Sign Out button then this function will Sign Out the user
  function userSignOut() {
    signOut(auth).then(() => {
      toast.success("Sign out success!")
      navigate("/sign-in")
    }).catch((error) => {
      toast.error("Sign out error!")
    });
  }

  return (
    <section className='flex flex-col gap-6'>

      {/* Fullscreen update profile picture */}
      <div className={`${showUpdateProfilePicture ? "visible opacity-100" : "invisible opacity-0"} transition-all z-50 duration-300 ease-in-out h-screen w-full flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]`}>
        {showUpdateProfilePicture && (<UpdateProfilePicture outsideClick={ref} setShowUpdateProfilePicture={setShowUpdateProfilePicture} image={photoURL} setUser={setUser} />)}
      </div>

      {/* Fullscreen update profile */}
      <div className={`${showUpdateProfile ? "visible opacity-100" : "invisible opacity-0"} transition-all z-50 duration-300 ease-in-out h-screen w-full flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]`}>
        {showUpdateProfile && (<UpdateProfile outsideClick={ref} setShowUpdateProfile={setShowUpdateProfile} name={name} setUser={setUser} />)}
      </div>

      <div className='flex flex-col items-center gap-3 p-4 bg-[#242527] rounded-md shadow-sm'>
        <img
          src={photoURL}
          alt="Profile"
          className='w-40 h-40 rounded-full shadow-sm object-center object-cover' />
        <h2 className='text-white font-bold text-xl tracking-wider'>{name}</h2>
      </div>

      <nav>
        <ul className='flex flex-col p-4 bg-[#242527] text-white rounded-md shadow-sm'>
          <li className='flex gap-4 py-5 w-full border-b-2 border-[#292a2c] md:hover:bg-[#2b2c2e] rounded-md px-2 cursor-pointer transition ease-in-out duration-200'
            onClick={() => setShowUpdateProfilePicture(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Change Profile Picture
          </li>
          <li className='flex gap-4 py-5 w-full border-b-2 border-[#292a2c] md:hover:bg-[#2b2c2e] rounded-md px-2 cursor-pointer transition ease-in-out duration-200'
            onClick={() => setShowUpdateProfile(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Profile settings
          </li>
          <li className='flex gap-4 py-5 w-full border-b-2 border-[#292a2c] hover:bg-[#2b2c2e] rounded-md px-2 cursor-pointer transition ease-in-out duration-200'
            onClick={() => setComponents("Videos")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Videos
          </li>
          <li className='flex gap-4 py-5 w-full border-b-2 border-[#292a2c] hover:bg-[#2b2c2e] rounded-md px-2 cursor-pointer transition ease-in-out duration-200'
            onClick={userSignOut}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Sign out
          </li>
        </ul>
      </nav>

    </section>
  )
}