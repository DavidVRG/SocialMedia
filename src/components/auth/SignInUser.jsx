import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

// This is the login component
export default function SignInUser({ setComponent, setLoading }) {

    // Import auth from firebase
    const auth = getAuth()

    // Import navigate from useNavigate
    const navigate = useNavigate()

    // userData object state
    const [userData, setUserData] = useState({
        email: 'test@test.com',
        password: 'test1234',
    })
    const { email, password } = userData

    // onChange function if the user type a letter in the input field.
    function onChangeUserData(e) {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    // Login function if the user click to the Sign In button
    function submitSignInUser(event) {
        event.preventDefault()
        setLoading(true)
        signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                setLoading(false)
                navigate("/")
            })
            .catch((error) => {
                setLoading(false)
                toast.error("Something wrong!")
            })
    }

    return (
        <form className='flex flex-col gap-4'
            onSubmit={submitSignInUser}>

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
                Sign In
            </button>

            <div>
                <span className="text-sm font-light text-white">Don't have an account yet?</span>
                <button
                    type="button"
                    className="font-medium text-primary-600 hover:underline text-blue-600 ml-1"
                    onClick={() => setComponent('sign-up')}>
                    Sign Up
                </button>
            </div>

        </form>
    )
}