import { getAuth, updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { db } from '../../firebase/firebase'
import { toast } from 'react-toastify'
import Loading from '../utils/Loading'


export default function UpdateProfilePicture({ setShowUpdateProfile, outsideClick, name, setUser }) {

    // Import auth from firebase
    const auth = getAuth()

    // Username string state
    const [username, setUsername] = useState(name)

    // If the user click to the update button then the app show the Loading component
    const [isLoading, setIsLoading] = useState(false)

    // If the user click to the update button then the onSubmitUpdateProfile button update the profile and the profile document
    function onSubmitUpdateProfile(event) {
        event.preventDefault()
        setIsLoading(true)
        updateProfile(auth.currentUser, {
            displayName: username
        })
            .then(() => {
                updateDoc(doc(db, "users", auth.currentUser.uid), {
                    name: username
                })
                    .then(() => {
                        setUser((prevState) => ({
                            ...prevState,
                            name: username
                        }))
                        setIsLoading(false)
                        toast.success("Upload is success!")
                    })
                    .catch((error) => {
                        setIsLoading(false)
                        toast.error("Something wrong!")
                    })
            })
            .catch((error) => {
                setIsLoading(false)
                toast.error("Something wrong!")
            })
    }

    return (
        isLoading ? (<Loading />) : (
            <section ref={outsideClick} className='relative  w-[95%] md:w-full max-w-3xl max-h-[600px] h-full text-white rounded-md shadow-sm bg-[#242527]'>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-[#242527] w-6 h-6 cursor-pointer absolute top-2 right-2"
                    onClick={() => setShowUpdateProfile(false)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <div className='flex flex-col items-center gap-10 h-full justify-center mx-auto w-[90%] md:w-[35%]'>
                    <h1 className='text-2xl font-medium'>Change Profile Data</h1>
                    <form className='flex flex-col gap-4 w-full' onSubmit={onSubmitUpdateProfile}>

                        <div className='flex flex-col'>
                            <label htmlFor="name" className='text-sm text-gray-300'>Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                className="p-2.5 bg-[#3b3c41] border-none rounded-lg shadow-sm placeholder-gray-400 text-white focus:outline-none" />
                        </div>

                        <button
                            type="submit"
                            className='bg-blue-600 p-2 rounded-md shadow-sm hover:bg-blue-700 transition duration-200 ease-in-out'>
                            Change
                        </button>

                    </form>

                </div>


            </section>
        )
    )
}