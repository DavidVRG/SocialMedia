import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase'
import { toast } from 'react-toastify'


// This is the register component that is visible if the user click to the register button in login page.
export default function CreateUser({ setComponent, setUser, setLoading }) {

    // Import navigate from useNavigate
    const navigate = useNavigate()

    // Import auth from firebase
    const auth = getAuth()

    // userData object state
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        name: ''
    })
    const { email, password, name } = userData

    // onChange function if the user type a letter in the input field.
    function onChangeUserData(e) {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    // Register function if the user click to the Sign Up button
    function submitCreateUser(event) {
        event.preventDefault()
        setLoading(true)

        // After the user is registered then the updateProfile function set the displayname and photoURL.
        // After the profile updated then the setDoc function set the user to the database.
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {

                await updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: "./profile.png"
                })
                    .then(() => {
                        return
                    })
                    .catch((error) => {
                        setLoading(false)
                        toast.error("Something wrong!")
                    })

                await setDoc(doc(db, "users", userCredential.user.uid), {
                    email: email,
                    name: name,
                    photoURL: "./profile.png"
                })
                    .then(() => {
                        setUser(() => ({
                            name: name,
                            photoURL: "./profile.png"
                        }))
                        setLoading(false)
                        navigate("/")
                    })
                    .catch((error) => {
                        setLoading(false)
                        toast.error("Something wrong")
                    })

            })
            .catch((error) => {
                setLoading(false)
                toast.error("Something wrong!")
            })
    }

    return (
        <form className='flex flex-col gap-4'
            onSubmit={submitCreateUser}>

            <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-white" htmlFor="email">Email</label>
                <input
                    className="p-2.5 bg-[#3b3c41] border-none rounded-lg shadow-sm placeholder-gray-400 text-white focus:outline-none"
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChangeUserData}
                    placeholder="Email address" />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-white" htmlFor="name">Full name</label>
                <input
                    className="p-2.5 bg-[#3b3c41] border-none rounded-lg shadow-sm placeholder-gray-400 text-white focus:outline-none"
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChangeUserData}
                    placeholder="Full name" />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-white" htmlFor="email">Password</label>
                <input
                    className="p-2.5 bg-[#3b3c41] border-none rounded-lg shadow-sm placeholder-gray-400 text-white focus:outline-none"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChangeUserData}
                    placeholder="Password" />
            </div>

            <button
                type="submit"
                className="w-full text-center rounded-md shadow-sm p-2.5 transition ease-in-out duration-200 bg-blue-600 hover:bg-blue-700 mt-2">
                Sign Up
            </button>

            <div>
                <span className="text-sm font-light text-white">Have you an account?</span>
                <button
                    type="button"
                    className="font-medium text-primary-600 hover:underline text-blue-600 ml-1"
                    onClick={() => setComponent('sign-in')}>
                    Sign In
                </button>
            </div>

        </form>
    )
}