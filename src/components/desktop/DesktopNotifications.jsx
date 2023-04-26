import React, { useContext } from 'react'
import Notification from '../utils/Notification'
import { AuthContext } from '../../context/AuthContext';

// Desktop notifications dropdown menu component
// If the user click to the notifications dropdown menu the the app show this component.
export default function DesktopNotifications({ dropdownMenu, setDropdownMenu }) {

    // Import notification and the new notification boolean from AuthContext
    const { notifications, newNotification } = useContext(AuthContext)

    return (
        <section className="relative w-10 h-10 rounded-full bg-[#3a3b3d] hover:bg-[#424346] transition ease-in-out duration-200  flex items-center justify-center">

            {newNotification && <div className="h-4 w-4 rounded-full bg-green-500 absolute bottom-0 -right-1" />}

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full p-2 cursor-pointer"
                onClick={() => {
                    dropdownMenu === "notifications" ? setDropdownMenu("") : setDropdownMenu("notifications")
                }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
            </svg>

            <div className={`absolute right-0 top-10 z-10 mt-2 w-[350px] origin-top-right rounded-md bg-[#242527] text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ${dropdownMenu === "notifications" ? "opacity-100 visisble" : "opacity-0 invisible"}`}>
                <div className='flex items-center justify-between px-4 py-2'>
                    <div className='text-xl font-medium'>Notifications</div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                        onClick={() => {
                            dropdownMenu === "notifications" ? setDropdownMenu("") : setDropdownMenu("notifications")
                        }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <ul className="py-1 overflow-y-scroll h-80">

                    {notifications && (
                        notifications.map((notification) => {
                            return (
                                <Notification key={notification.id} data={notification} />
                            )
                        })
                    )}

                </ul>
            </div>

        </section>
    )
}
