import React, { useEffect, useRef, useState } from 'react'
import Card from './Card'
import MakeStory from './MakeStory'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import FullScreenImage from '../utils/FullScreenImage'

// Story Cardlist component
export default function CardList() {

    // Ref for outsideclick
    const ref = useRef()

    // Firebase onSnaphot event set the stories to stories state
    const [stories, setStories] = useState([])

    // If the user click to the image then the app will show the FullScreenImage component
    const [showFullscreenImage, setShowFullscreenImage] = useState(false)

    // Set date for the fullscreen image
    const [imageDate, setImageDate] = useState(null)

    // Set image for the fullscreen image
    const [fullScreenImageURL, setFullScreenImageURL] = useState(null)

    // Until the Firebase onSnapshot listener fetching the data then loading set to true
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const compareDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const q = query(collection(db, "stories"), orderBy("timestamp", "desc"), where("timestamp", ">", compareDate))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const stories = [];
            querySnapshot.forEach((doc) => {
                stories.push({
                    data: doc.data(),
                    id: doc.id
                });
            });
            setStories(stories)
            setLoading(false)
        });
        return () => unsubscribe;
    }, [])

    // If the user click outside then the currrent component set to hidden
    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the previous comments is open and the clicked target is not within the previous comments,
            // then close the previous comments
            if (showFullscreenImage !== false && ref.current && !ref.current.contains(e.target)) {
                setShowFullscreenImage(false)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [showFullscreenImage])

    return (
        <section className='w-full flex'>

            {/* Fullscreen image */}
            <div className={`${showFullscreenImage ? "visible opacity-100" : "invisible opacity-0"} transition-all duration-300 ease-in-out h-screen z-50 w-full flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]`}>
                {showFullscreenImage && FullScreenImage && (<FullScreenImage outsideClick={ref} date={imageDate} setShowFullscreenImage={setShowFullscreenImage} image={fullScreenImageURL} />)}
            </div>

            <div className='w-1/3 md:w-[20%] mx-1'>
                <MakeStory />
            </div>

            <div className={`hidden ${stories.length > 4 ? "md:block" : "md:flex"} w-[80%]`}>
                {loading === false && stories.length > 4 && (
                    <Slide autoplay={false} transitionDuration={200} slidesToScroll={4} slidesToShow={4} infinite={false}>
                        {stories.map((story, index) => (
                            <div key={index} className='mx-1'
                                onClick={() => {
                                    setFullScreenImageURL(story.data.photoURL),
                                        setImageDate(story.data.createdAt),
                                        setShowFullscreenImage(true)
                                }} >
                                <Card key={story.id} data={story} />
                            </div>
                        ))}
                    </Slide>
                )}
                {loading === false && stories.length !== 0 && stories.length <= 4 && (
                    stories.map((story, index) => {
                        return (
                            <div className='w-1/4 mx-1' key={index}
                                onClick={() => {
                                    setFullScreenImageURL(story.data.photoURL),
                                        setImageDate(story.data.createdAt),
                                        setShowFullscreenImage(true)
                                }}>
                                <Card key={story.id} data={story} />
                            </div>
                        )
                    })
                )}
            </div>

            <div className={`md:hidden ${stories.length > 2 ? "block" : "flex"} w-2/3`}>
                {loading === false && stories.length > 2 && (
                    <Slide autoplay={false} transitionDuration={200} slidesToScroll={2} slidesToShow={2} infinite={false}>
                        {stories.map((story, index) => (
                            <div key={index} className='mx-1'
                                onClick={() => {
                                    setFullScreenImageURL(story.data.photoURL),
                                        setShowFullscreenImage(true)
                                }} >
                                <Card key={story.id} data={story} />
                            </div>
                        ))}
                    </Slide>
                )}
                {loading === false && stories.length !== 0 && stories.length <= 2 && (
                    stories.map((story, index) => {
                        return (
                            <div className='w-1/2 mx-1' key={index}
                                onClick={() => {
                                    setFullScreenImageURL(story.data.photoURL),
                                        setImageDate(story.data.createdAt),
                                        setShowFullscreenImage(true)
                                }}>
                                <Card key={story.id} data={story} />
                            </div>
                        )
                    })
                )}
            </div>
        </section>
    )
}