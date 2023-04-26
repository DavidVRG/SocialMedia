import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import FullScreenImage from './FullScreenImage';

export default function PostMedia({ type, data }) {

    // Ref for outsideclick
    const ref = useRef()

    // If the user click to the image then the app will set the image for the FullScreenImage component
    const [fullScreenImage, setFullScreenImage] = useState(false)

    // If the user click to the image then the app will show the FullScreenImage component
    const [showFullScreenImage, setShowFullScreenImage] = useState(false)

    // If the user click outside then the currrent component set to hidden
    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the previous comments is open and the clicked target is not within the previous comments,
            // then close the previous comments
            if (showFullScreenImage !== false && ref.current && !ref.current.contains(e.target)) {
                setShowFullScreenImage(false)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [showFullScreenImage])

    return (
        <div>

            {/* Fullscreen image */}
            <div className={`${showFullScreenImage ? "visible opacity-100" : "invisible opacity-0"} transition-all z-50 duration-300 ease-in-out h-screen w-full flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]`}>
                {showFullScreenImage && (<FullScreenImage outsideClick={ref} setShowFullscreenImage={setShowFullScreenImage} image={fullScreenImage} />)}
            </div>

            {/* Post image */}
            {(type === "TimelinePost" && data.photoURL.length === 1) && (
                <img
                    onClick={() => {
                        setShowFullScreenImage(true),
                            setFullScreenImage(data.photoURL)
                    }}
                    src={data.photoURL}
                    alt="Post"
                    className="w-full h-[400px] object-cover object-center mb-4 cursor-pointer"
                />
            )}

            {/* Post image */}
            {(type === "TimelinePost" && data.photoURL.length > 1) && (
                <div className="slide-container">
                    <Slide autoplay={false} transitionDuration={500}>
                        {data.photoURL.map((slideImage, index) => (
                            <div key={index}>
                                <div
                                    onClick={() => {
                                        setShowFullScreenImage(true)
                                        setFullScreenImage(slideImage)
                                    }}
                                    className='flex items-center justify-center bg-cover bg-center h-[400px] mb-4 cursor-pointer'
                                    style={{ 'backgroundImage': `url(${slideImage})` }}
                                />
                            </div>
                        ))}
                    </Slide>
                </div>
            )}

            {/* Post mixed */}
            {(type === "MixedPost" && data.photoURL.length >= 1) && (
                <div className="slide-container">
                    <Slide autoplay={false} transitionDuration={500}>
                        {data.photoURL.map((slideImage, index) => (
                            <div key={index}>
                                <div
                                    onClick={() => {
                                        setShowFullScreenImage(true)
                                        setFullScreenImage(slideImage)
                                    }}
                                    className='flex items-center justify-center bg-cover bg-center h-[400px] mb-4 cursor-pointer'
                                    style={{ 'backgroundImage': `url(${slideImage})` }}
                                />
                            </div>
                        ))}
                        <div className='flex items-center justify-center h-[400px] mb-4 w-full'>
                            <ReactPlayer
                                url={data.videoURL}
                                width='100%'
                                height='100%'
                                controls={true}
                            />
                        </div>
                    </Slide>
                </div>
            )}

            {/* Post video */}
            {type === "VideoPost" && (
                <div className='h-[400px] mb-4'>
                    <ReactPlayer
                        url={data.videoURL}
                        width='100%'
                        height='100%'
                        controls={true}
                    />
                </div>
            )}
        </div>
    )
}