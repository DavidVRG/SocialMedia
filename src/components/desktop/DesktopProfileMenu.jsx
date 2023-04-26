import React from 'react'
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Desktop profile drowdown menu component
// If the user click to the profile dropdown menu the the app show this component.
export default function DesktopProfileMenu({ dropdownMenu, setDropdownMenu, setComponents }) {

    // Import auth from firebase
    const auth = getAuth()

    // Import navigate from useNavigate
    const navigate = useNavigate()

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
        <nav className="relative w-10 h-10 rounded-full bg-[#3a3b3d] hover:bg-[#424346] transition ease-in-out duration-200  flex items-center justify-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full p-2"
                onClick={() => {
                    dropdownMenu === "profile" ? setDropdownMenu("") : setDropdownMenu("profile")
                }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

            <div className={`absolute right-0 top-10 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#242527] text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ${dropdownMenu === "profile" ? "opacity-100 visisble" : "opacity-0 invisible"}`}>
                <ul className="py-1">
                    <li onClick={() => { setComponents("Profile"), setDropdownMenu("") }} className="block px-4 py-2 text-sm transition ease-in-out duration-200 hover:bg-[#2b2c2e]">Account</li>
                    <li onClick={userSignOut} className="block px-4 py-2 text-sm transition ease-in-out duration-200 hover:bg-[#2b2c2e]">Sign Out</li>
                </ul>
            </div>

        </nav>
    )
}
