import React, { useEffect, useRef, useState } from 'react'
import PreviousComments from './PreviousComments'
import TimelinePostComments from '../timeline/TimelinePostComments'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import Moment from 'react-moment'
import { getAuth } from 'firebase/auth'
import { LikePost } from './LikePost'
import { WriteComment } from './WriteComment'
import FullScreenProfile from './FullScreenProfile'
import PostMedia from './PostMedia'
import EmojiPicker from 'emoji-picker-react'
import { toast } from 'react-toastify'

// Desktop and mobile timeline or video post
export default function TimelinePost({ commentId, type, data, id }) {

    // Import Auth from firebase
    const auth = getAuth()

    // Ref for outsideclick
    const ref = useRef()

    // If the user click to the previous comments then the app will show the PreviousComments component
    const [showPreviousComments, setShowPreviousComments] = useState(false)

    // If the user click to the profile image then the app will show the FullScreenProfile component
    const [showFullScreenProfile, setShowFullScreenProfile] = useState(false)

    // This component set the max word limit if the user will click to the text
    const [wrap, setWrap] = useState(true)

    // If the user click to the emoji the the app show the emoji picker component
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    // State for FullScreenProfile
    const [fullScreenProfileData, setFullScreenProfileData] = useState(null)

    // If the user write a comment then the state will set the text value
    const [commentText, setCommentText] = useState("")

    // Set the author data
    const [authorData, setAuthorData] = useState(null)

    // Triggered by post data
    useEffect(() => {
        async function getAuthorData() {
            const docSnap = await getDoc(doc(db, "users", data.author))
            setAuthorData(docSnap.data())
        }
        getAuthorData()
    }, [data])

    // If the user click outside then the currrent component set to hidden
    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the previous comments is open and the clicked target is not within the previous comments,
            // then close the previous comments
            if ((showPreviousComments !== false || showFullScreenProfile !== false || showEmojiPicker !== false) && ref.current && !ref.current.contains(e.target)) {
                setShowPreviousComments(false)
                setShowFullScreenProfile(false)
                setShowEmojiPicker(false)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [showPreviousComments, showFullScreenProfile, showEmojiPicker])

    // If the user click to the x on post
    function deletePost() {
        const result = confirm("Are you sure to want to delete it?")
        if (result) {
            deleteDoc(doc(db, "posts", id))
                .then(() => {
                    toast.success("Post delete success!")
                })
                .catch((error) => {
                    toast.error("Something wrong!")
                })
        }
    }

    return (
        authorData && data && auth.currentUser && (
            <article className='relative w-full max-h-full bg-[#242527] rounded-md shadow-sm p-4 mb-6'>

                {/* Previous comments */}
                <div className={`${showPreviousComments ? "visible opacity-100" : "invisible opacity-0"} transition-all duration-300 z-50 ease-in-out h-screen w-full flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]`}>
                    {showPreviousComments && (<PreviousComments auth={auth} id={id} data={data} outsideClick={ref} setShowPreviousComments={setShowPreviousComments} />)}
                </div>

                {/* Fullscreen profile */}
                <div className={`${showFullScreenProfile ? "visible opacity-100" : "invisible opacity-0"} transition-all z-50 duration-300 ease-in-out h-screen w-full flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]`}>
                    {showFullScreenProfile && fullScreenProfileData && (<FullScreenProfile outsideClick={ref} setShowFullScreenProfile={setShowFullScreenProfile} image={fullScreenProfileData.image} name={fullScreenProfileData.name} id={fullScreenProfileData.id} />)}
                </div>

                {data.author === auth.currentUser.uid && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white absolute top-2 right-2 cursor-pointer"
                        onClick={deletePost}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}

                {/* Author name, picture and time */}
                <div className='flex gap-2 mb-4'>
                    <div className='w-12 h-12 rounded-full cursor-pointer'
                        onClick={() => {
                            setFullScreenProfileData({
                                image: authorData.photoURL,
                                name: authorData.name,
                                id: data.author
                            })
                            setShowFullScreenProfile(true)
                        }}>
                        <img
                            src={authorData.photoURL}
                            alt="Profile Picture"
                            className='object-cover object-center w-full h-full rounded-full' />
                    </div>
                    <div className='text-white'>
                        <span className='block font-medium'>{authorData.name}</span>
                        <time className='text-sm font-thin text-gray-300'>
                            <Moment date={new Date(data.createdAt)} fromNow />
                        </time>
                    </div>
                </div>

                <p onClick={() => setWrap(prev => !prev)} className={`mb-2 ${wrap ? "wrap-content" : ""} text-white`}>{data.text}</p>

                <PostMedia type={type} data={data} />

                {/* Likes count */}
                <div className='flex gap-2 text-gray-300'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white bg-blue-600 p-[3px] rounded-full shadow-sm">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                    <div>{data.likes.length} like</div>
                </div>

                <div className='h-[1px] w-full bg-[#2c2d30] my-3' />

                {/* Like and comment */}
                <div className='flex gap-8 text-gray-300'>

                    <button className='flex gap-2 cursor-pointer'
                        onClick={() => LikePost(id, auth)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                        </svg>
                        Like
                    </button>

                    <button className='flex gap-2'>
                        <label htmlFor={`comment-${commentId}`} className='flex gap-2 cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            Comment
                        </label>
                    </button>

                </div>

                <div className='h-[1px] w-full bg-[#2c2d30] my-3' />

                <div>
                    {/* Comment list */}
                    <div className='w-full'>
                        <div className='w-full cursor-pointer'>
                            <button className='text-gray-300 mb-4 w-full text-start'
                                onClick={() => setShowPreviousComments(true)}>
                                Previous comments
                            </button>
                        </div>

                        <div className='flex flex-col-reverse'>
                            {data.comments.slice().reverse().map((comment, index) => {
                                if (index <= 1) {
                                    return (
                                        <TimelinePostComments key={index} id={id} comment={comment} setFullScreenProfileData={setFullScreenProfileData} setShowFullScreenProfile={setShowFullScreenProfile} />
                                    )
                                }
                            })}
                        </div>

                    </div>

                    {/* Create a new comment */}
                    <form onSubmit={(event) => event.preventDefault()} className='relative'>

                        <div className='relative flex items-center'>
                            <input
                                onKeyDown={(event) => WriteComment(commentText, setCommentText, id, auth, event)}
                                className="p-2.5 w-full bg-[#3b3c41] border-none rounded-3xl shadow-sm placeholder-gray-400 text-white focus:outline-none"
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                name="post"
                                id={`comment-${commentId}`}
                                placeholder="Write a comment!" />

                            <div onClick={() => setShowEmojiPicker(prevState => !prevState)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute top-2.5 right-2.5 w-6 h-6 cursor-pointer text-gray-300 hover:text-gray-200">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                                </svg>
                            </div>
                        </div>

                        <div ref={ref} className={`absolute z-50 bottom-12 md:bottom-8 right-3.5 md:right-8 transition-all duration-500 ${showEmojiPicker ? "visible opacity-100" : "invisible opacity-0"}`}>
                            {showEmojiPicker && (
                                <EmojiPicker
                                    width={300}
                                    height={300}
                                    theme='dark'
                                    searchDisabled={true}
                                    lazyLoadEmojis={true}
                                    onEmojiClick={(emojiObject) => setCommentText((prevMsg) => prevMsg + emojiObject.emoji)} />
                            )}
                        </div>

                    </form>
                </div>

            </article>
        )
    )
}