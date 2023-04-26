import React, { useEffect, useRef, useState } from 'react'
import FullScreenNotification from './FullScreenNotification'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import Moment from 'react-moment'
import { toast } from 'react-toastify'
import { getAuth } from 'firebase/auth'

// Desktop and mobile notification
export default function Notification({ data }) {

    // Import Auth from firebase
    const auth = getAuth()

    // Ref for outsideclick
    const ref = useRef()

    // Set the author data
    const [authorData, setAuthorData] = useState(null)

    // If the user click to the notification then the app will show the FullScreenNotification component
    const [showFullScreenNotification, setShowFullScreenNotification] = useState(false)

    // If the user click outside then the currrent component set to hidden
    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the previous comments is open and the clicked target is not within the previous comments,
            // then close the previous comments
            if (showFullScreenNotification !== false && ref.current && !ref.current.contains(e.target)) {
                setShowFullScreenNotification(false)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [showFullScreenNotification])

    // Triggered by post data
    useEffect(() => {
        async function getAuthorData() {
            const docSnap = await getDoc(doc(db, "users", data.data.author))
            setAuthorData(docSnap.data())
        }
        getAuthorData()
    }, [data])

    // If the user click to the notification then the app set the seen to true
    function seenNotification() {
        const docRef = doc(db, "posts", data.id)
        updateDoc(docRef, {
            seen: arrayUnion(auth.currentUser.uid)
        }).catch((error) => toast.error("Something wrong!"))
    }

    return (
        authorData && (
            <figure className='w-full'>
                {/* Fullscreen notification */}
                <div className={`${showFullScreenNotification ? "visible opacity-100" : "invisible opacity-0"} transition-all duration-300 z-50 ease-in-out h-screen w-full flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]`}>
                    {showFullScreenNotification && (<FullScreenNotification outsideClick={ref} data={data} authorData={authorData} setShowFullScreenNotification={setShowFullScreenNotification} />)}
                </div>

                <li className="flex px-0 md:px-2 py-2 text-sm cursor-pointer"
                    onClick={() => {
                        setShowFullScreenNotification(true),
                            seenNotification()
                    }}>
                    <div className={`${data.seen ? "bg-[#242527] md:bg-[#3b3c41] hover:bg-[#36373b]" : "bg-[#717bc7] md:bg-[#717bc7]"} w-full px-4 py-5 md:px-2 md:py-3 text-white rounded-md shadow-sm transition ease-in-out duration-200`}>
                        <div className='flex justify-between'>
                            <div className='flex items-center gap-1 mb-1'>
                                <div className='w-6 h-6 rounded-full'>
                                    <img
                                        src={authorData.photoURL}
                                        alt={authorData.name}
                                        className='object-cover object-center w-full h-full rounded-full' />
                                </div>
                                <span className='block font-medium'>{authorData.name}</span>
                            </div>
                            <time>
                                {data.type === "post" ? (
                                    <Moment date={new Date(data.data.createdAt)} fromNow />
                                ) : (
                                    <Moment date={new Date(data.data.updatedAt)} fromNow />
                                )}
                            </time>
                        </div>
                        <p>{data.type === "post" ? `${authorData.name} make a new post!` : `${authorData.name}'s post has a new comment!`}</p>
                    </div>
                </li>
            </figure>
        )
    )
}