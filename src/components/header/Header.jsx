import React, { useContext, useEffect, useRef, useState } from 'react'
import DesktopChatList from '../desktop/DesktopChatList'
import DesktopNotifications from '../desktop/DesktopNotifications'
import DesktopProfileMenu from '../desktop/DesktopProfileMenu'
import { AuthContext } from '../../context/AuthContext'

// Desktop and mobile header navigation menu component
export default function Header({ setComponents, components, setCurrentChat, setUser }) {

    // Ref for outsideclick
    const ref = useRef()

    // Import newMessage and newNotification booleans from AuthContext
    const { newMessage, newNotification } = useContext(AuthContext)

    // DropdownMenu string state because the callname of components are string
    const [dropdownMenu, setDropdownMenu] = useState("")

    // If the user click outside then the currrent component set to hidden
    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            if (dropdownMenu !== "" && ref.current && !ref.current.contains(e.target)) {
                setDropdownMenu("")
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [dropdownMenu])

    return (
        <header className='fixed top-0 left-0 right-0 z-50 w-full bg-[#242527] px-2 md:px-4 border-b-[1px] border-[#2e2f31]'>
            <div className='w-full flex items-center'>

                {/* Desktop Logo */}

                <div className='hidden md:block w-1/3 cursor-pointer'>
                    <a href="/">
                        <img src={'./logo.png'} alt="Header Logo" className='max-w-[40px]' />
                    </a>
                </div>

                {/* Desktop Center Navigation Menu */}

                <nav className='hidden md:flex text-[#909195] w-1/3 justify-center'>

                    <div className={`w-[80px] flex justify-center items-center ${components === "Timeline" ? "py-[8px] border-b-4 border-blue-500" : "py-[12px]"} cursor-pointer transition ease-in-out duration-200 hover:text-white hover:bg-[#2b2c2e]`}
                        onClick={() => setComponents("Timeline")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    </div>

                    <div className={`w-[80px] flex justify-center items-center ${components === "Videos" ? "py-[8px] border-b-4 border-blue-500" : "py-[12px]"} cursor-pointer transition ease-in-out duration-200 hover:text-white hover:bg-[#2b2c2e]`}
                        onClick={() => setComponents("Videos")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>

                </nav>

                {/* Desktop Right Navigation Menu */}

                <nav className='hidden md:flex gap-3 text-white w-1/3 justify-end' ref={ref}>

                    <DesktopChatList dropdownMenu={dropdownMenu} setDropdownMenu={setDropdownMenu} setComponents={setComponents} setCurrentChat={setCurrentChat} setUser={setUser} />

                    <DesktopNotifications dropdownMenu={dropdownMenu} setDropdownMenu={setDropdownMenu} />

                    <DesktopProfileMenu dropdownMenu={dropdownMenu} setDropdownMenu={setDropdownMenu} components={components} setComponents={setComponents} />

                </nav>

                {/* Mobile Navigation Menu */}

                <nav className="w-full flex md:hidden justify-between items-center text-[#909195]">

                    <div className={`w-[80px] flex justify-center items-center ${components === "Timeline" ? "py-[14px] border-b-4 border-blue-500" : "py-[18px]"} cursor-pointer transition ease-in-out duration-200 hover:text-white hover:bg-[#2b2c2e]`}
                        onClick={() => setComponents("Timeline")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    </div>

                    <div className={`relative w-[80px] flex justify-center items-center ${components === "Chat" ? "py-[14px] border-b-4 border-blue-500" : "py-[18px]"} cursor-pointer transition ease-in-out duration-200 hover:text-white hover:bg-[#2b2c2e]`}
                        onClick={() => setComponents("ChatList")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                        {newMessage && <div className="h-3 w-3 rounded-full bg-green-500 absolute bottom-4 right-7" />}
                    </div>

                    <div className={`relative w-[80px] flex justify-center items-center ${components === "Notifications" ? "py-[14px] border-b-4 border-blue-500" : "py-[18px]"} cursor-pointer transition ease-in-out duration-200 hover:text-white hover:bg-[#2b2c2e]`}
                        onClick={() => setComponents("Notifications")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                        </svg>
                        {newNotification && <div className="h-3 w-3 rounded-full bg-green-500 absolute bottom-4 right-7" />}
                    </div>

                    <div className={`w-[80px] flex justify-center items-center ${components === "Profile" ? "py-[14px] border-b-4 border-blue-500" : "py-[18px]"} cursor-pointer transition ease-in-out duration-200 hover:text-white hover:bg-[#2b2c2e]`}
                        onClick={() => setComponents("Profile")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>

                </nav>

            </div>
        </header>
    )
}