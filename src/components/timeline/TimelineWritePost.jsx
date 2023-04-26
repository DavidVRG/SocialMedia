import React, { useEffect, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';
import Dropzone from 'react-dropzone'
import { UploadImage } from '../utils/UploadImage';
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import { db } from '../../firebase/firebase'
import { toast } from 'react-toastify';
import Loading from '../utils/Loading';

// Desktop and mobile homepage write post component
export default function TimelineWritePost() {

    // Import Auth from firebase
    const auth = getAuth()

    // Ref for outsideclick
    const ref = useRef()

    // If the user click to the Post button then the app show the Loading component
    const [loading, setLoading] = useState(false)

    // If the user click to the emoji the the app show the emoji picker component
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    // If the user click to the Insert Video button then the app show the Insert Video input field
    const [showInstertVideo, setShowInstertVideo] = useState(false)

    // If the user click to the Upload Image button then the app show the Upload Image input field
    const [showUploadImage, setShowUploadImage] = useState(false)

    // If the user select a profile picture then the photoURL state send the picture to the UploadSingleImage component
    const [photoURL, setPhotoURL] = useState([])

    // If the user write text for post then the text set to the text state
    const [text, setText] = useState("")

    // If the user insert video for post then the video set to the video state
    const [video, setVideo] = useState("")

    // If the user click outside then the currrent component set to hidden
    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If the previous comments is open and the clicked target is not within the previous comments,
            // then close the previous comments
            if (showEmojiPicker !== false && ref.current && !ref.current.contains(e.target)) {
                setShowEmojiPicker(false)
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    }, [showEmojiPicker])

    // If the user click to the Post button then the post will upload
    async function onSubmitWritePost(event) {
        event.preventDefault()
        setLoading(true)
        if (photoURL.length > 0) {

            return Promise.all(
                photoURL.map((item) => {
                    return UploadImage(item, setLoading)
                })
            )
                .then((downloadURL) => {
                    addDoc(collection(db, "posts"), {
                        text: text,
                        photoURL: downloadURL,
                        videoURL: video,
                        author: auth.currentUser.uid,
                        seen: [auth.currentUser.uid],
                        likes: [],
                        type: video ? "MixedPost" : "TimelinePost",
                        comments: [],
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    });
                })
                .then(() => {
                    setText("")
                    setVideo("")
                    setPhotoURL([])
                    setShowInstertVideo(false)
                    setShowUploadImage(false)
                    setLoading(false)
                    toast.success("Post upload success!")
                })
                .catch((error) => {
                    setLoading(false)
                    toast.error("Something wrong!")
                })
        } else {
            await addDoc(collection(db, "posts"), {
                text: text,
                photoURL: "",
                videoURL: video,
                likes: [],
                seen: [auth.currentUser.uid],
                comments: [],
                type: video ? "VideoPost" : "TimelinePost",
                author: auth.currentUser.uid,
                createdAt: Date.now(),
                updatedAt: Date.now()
            })
                .then(() => {
                    setText("")
                    setVideo("")
                    setShowInstertVideo(false)
                    setLoading(false)
                    toast.success("Post upload success!")
                })
                .catch((error) => {
                    setLoading(false)
                    toast.error("Something wrong!")
                })
        }

    }

    // Delete image from photoURL state
    function deleteImage(img) {
        const templateArray = [...photoURL]
        let index = photoURL.indexOf(img)
        templateArray.splice(index, 1)
        setPhotoURL(templateArray)
    }

    return (
        loading ? (<Loading />) : (
            <section className='w-full mt-6 p-4 bg-[#242527] rounded-md shadow-md'>

                <form onSubmit={onSubmitWritePost}>
                    <textarea
                        className="p-2.5 min-h-[100px] md:min-h-0 resize-y w-full bg-[#3b3c41] rounded-3xl shadow-sm placeholder-gray-400 text-white focus:outline-none"
                        type="text"
                        id="post"
                        required
                        name='text'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's on your mind?" />

                    <div className='h-[1px] w-full bg-[#2c2d30] mt-4 mb-2.5 md:mb-5' />

                    {photoURL.length !== 0 && (
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-4'>
                            {photoURL.map((img, id) => {
                                return (
                                    <div key={id} className='relative'>
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt="Profile Photo"
                                            className='object-cover object-center w-full h-44 rounded-md shadow-sm' />

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute top-2 right-2 text-white bg-[#242527] rounded-md shadow-sm cursor-pointer"
                                            onClick={() => { deleteImage(img) }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>

                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {showInstertVideo && (
                        <div className='my-4 relative'>

                            <input
                                type="text"
                                name="video"
                                id="video"
                                value={video}
                                onChange={(e) => setVideo(e.target.value)}
                                placeholder='Paste a link here'
                                className='w-full rounded-3xl shadow-sm bg-[#3b3c41] p-2.5 placeholder-gray-400 text-white focus:outline-none' />

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-[#3b3c41] cursor-pointer text-white w-6 h-6 absolute right-2.5 z-50 top-2.5"
                                onClick={() => setShowInstertVideo(false)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>

                        </div>
                    )}

                    {showUploadImage && (
                        <div className='my-4 relative'>

                            <Dropzone multiple={true} onDrop={acceptedFiles => {
                                setPhotoURL(prevState => [...prevState, ...acceptedFiles])
                            }}>
                                {({ getRootProps, getInputProps }) => (
                                    <section className='w-full rounded-3xl shadow-sm bg-[#3b3c41] p-2.5 text-gray-400 focus:outline-none text-center cursor-pointer'>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} accept='image/jpeg, image/png, image/gif' />
                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-[#3b3c41] cursor-pointer text-white w-6 h-6 absolute right-2.5 z-20 top-2.5"
                                onClick={() => setShowUploadImage(false)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>

                        </div>
                    )}

                    <div className='flex flex-row-reverse md:flex-row justify-center mb-2.5 md:mb-5 gap-10 text-[#909195]'>

                        <button
                            onClick={() => setShowUploadImage(prevState => !prevState)}
                            type="button"
                            className='flex gap-1 hover:text-[#a4a6af] py-2 md:py-0'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            Upload image
                        </button>

                        <button
                            onClick={() => setShowInstertVideo(prevState => !prevState)}
                            type="button"
                            className='flex gap-1 hover:text-[#a4a6af] py-2 md:py-0'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            Insert video
                        </button>

                        <div className='relative' ref={ref}>
                            <div className='p-2 md:p-0' onClick={() => setShowEmojiPicker(prevState => !prevState)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer hover:text-[#a4a6af]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                                </svg>
                            </div>

                            <div className={`absolute z-50 bottom-8 md:bottom-0 left-0 md:left-8 transition-all duration-500 ${showEmojiPicker ? "visible opacity-100" : "invisible opacity-0"}`}>
                                {showEmojiPicker && (
                                    <EmojiPicker
                                        width={300}
                                        height={300}
                                        theme='dark'
                                        searchDisabled={true}
                                        lazyLoadEmojis={true}
                                        onEmojiClick={(emojiObject) => setText((prevMsg) => prevMsg + emojiObject.emoji)} />
                                )}
                            </div>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className='px-6 py-2 w-full transition ease-in-out duration-200 bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm text-white'>
                        Post
                    </button>

                </form>

            </section>
        )
    )
}