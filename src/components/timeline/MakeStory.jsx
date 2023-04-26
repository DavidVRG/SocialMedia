import React, { useEffect, useRef, useState } from 'react'
import FullScreenMakeStory from '../utils/FullScreenMakeStory'

export default function MakeStory() {

    // Ref for outsideclick
    const ref = useRef()

    // If the user click to the image then the app will show the FullScreenImage component
    const [showFullScreenMakeStory, setShowFullScreenMakeStory] = useState(false)

    // If the user click outside then the currrent component set to hidden
    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the previous comments is open and the clicked target is not within the previous comments,
            // then close the previous comments
            if (showFullScreenMakeStory !== false && ref.current && !ref.current.contains(e.target)) {
                setShowFullScreenMakeStory(false)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [showFullScreenMakeStory])

    return (
        <article>

            {/* Fullscreen Make Story */}
            <div className={`${showFullScreenMakeStory ? "visible opacity-100" : "invisible opacity-0"} transition-all z-50 duration-300 ease-in-out h-screen w-full flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]`}>
                {showFullScreenMakeStory && (<FullScreenMakeStory outsideClick={ref} setShowFullScreenMakeStory={setShowFullScreenMakeStory} />)}
            </div>

            {/* Card */}
            <div className='relative w-full h-44 overflow-hidden rounded-lg shadow-md flex flex-col justify-center items-center cursor-pointer bg-[#242527]'>
                <div className='w-full h-full absolute top-0 left-0 right-0 bottom-0 gradient-hover-effect'
                    onClick={() => setShowFullScreenMakeStory(true)} />

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>

                <p className='font-medium tracking-wider'>Make story</p>
            </div>

        </article>
    )
}
