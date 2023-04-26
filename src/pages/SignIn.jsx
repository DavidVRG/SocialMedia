import React, { useState } from 'react'
import CreateUser from '../components/auth/CreateUser'
import SignInUser from '../components/auth/SignInUser'
import Loading from '../components/utils/Loading'

// Desktop and mobile signin and signup page
export default function SignIn({ setUser }) {

    // If the user click to the signin or signup then the app show the component (signin is the default component)
    const [component, setComponent] = useState('sign-in')

    // If the user click to the SignIn button then the app show the Loading component
    const [loading, setLoading] = useState(false)

    return (
        loading ? (<Loading />) : (
            <main className="w-[95%] md:w-full h-screen mx-auto flex justify-center items-center">
                <div className="w-full max-w-md text-white bg-[#242527] py-6 px-6 md:px-12 rounded-md shadow-md">

                    <h1 className="text-3xl text-center font-bold mb-6">Social Media</h1>

                    {component === 'sign-in' ? (

                        <SignInUser setComponent={setComponent} setLoading={setLoading} />

                    ) : (
                        <CreateUser setComponent={setComponent} setUser={setUser} setLoading={setLoading} />
                    )}

                </div>
            </main>
        )
    )
}