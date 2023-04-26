import { doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../firebase/firebase'
import FullScreenProfile from './FullScreenProfile'
import { toast } from 'react-toastify'
import { getAuth } from 'firebase/auth'

// Desktop and mobile previous comment component
export default function PreviousComment({ comment, id }) {

    // Import auth from firebase
    const auth = getAuth()

    // Ref for outsideclick
    const ref = useRef()

    const [wrap, setWrap] = useState(true)

    // State for FullScreenProfile
    const [fullScreenProfileData, setFullScreenProfileData] = useState(null)

    // If the user click to the profile image then the app will show the FullScreenProfile component
    const [showFullScreenProfile, setShowFullScreenProfile] = useState(false)

    // Set the author data
    const [authorData, setAuthorData] = useState(null)

    // Triggered by post data
    useEffect(() => {
        async function getAuthorData() {
            const docSnap = await getDoc(doc(db, "users", comment.author))
            setAuthorData(docSnap.data())
        }
        getAuthorData()
    }, [comment])

    // If the user click outside then the currrent component set to hidden
    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the previous comments is open and the clicked target is not within the previous comments,
            // then close the previous comments
            if (showFullScreenProfile !== false && ref.current && !ref.current.contains(e.target)) {
                setShowFullScreenProfile(false)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [showFullScreenProfile])

    // If the user click to the delete on comment
    async function deletePost() {
        const docRef = doc(db, "posts", id)
        const docSnap = await getDoc(docRef)
        const comments = docSnap.data().comments
        const index = comments.findIndex(object => {
            return object.text === comment.text
        })
        comments.splice(index, 1)
        updateDoc(docRef, {
            comments: comments
        })
            .then(() => {
                toast.success("Comment remove success!")
            })
            .catch((error) => {
                toast.error("Something wrong!")
            })
    }

    return (
        authorData && (
            <figure>

                {/* Fullscreen profile */}
                <div className={`${showFullScreenProfile ? "visible opacity-100" : "invisible opacity-0"} transition-all z-50 duration-300 ease-in-out h-screen w-full flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]`}>
                    {showFullScreenProfile && fullScreenProfileData && (<FullScreenProfile outsideClick={ref} setShowFullScreenProfile={setShowFullScreenProfile} image={fullScreenProfileData.image} name={fullScreenProfileData.name} id={fullScreenProfileData.id} />)}
                </div>

                <li className='flex gap-2 my-4'>

                    <div className='w-8 h-8 rounded-full shrink-0 cursor-pointer'
                        onClick={() => {
                            setFullScreenProfileData({
                                image: authorData.photoURL,
                                name: authorData.name,
                                id: comment.author
                            })
                            setShowFullScreenProfile(true)
                        }}>
                        <img
                            src={authorData.photoURL}
                            alt={authorData.name}
                            className='object-cover object-center w-full h-full rounded-full' />
                    </div>

                    <div>
                        <div className='bg-[#3b3c41] p-3 text-white rounded-3xl shadow-sm'>
                            <span className='block font-medium'>{authorData.name}</span>
                            <p className={`${wrap ? "wrap-content" : ""} break-all`}
                                onClick={() => setWrap(prevState => !prevState)}>
                                {comment.text}
                            </p>
                        </div>

                        {comment.author === auth.currentUser.uid && (
                            <button
                                onClick={deletePost}
                                className='text-gray-300 text-sm font-medium pl-3'>
                                Delete
                            </button>
                        )}
                    </div>

                </li>
            </figure>
        )
    )
}