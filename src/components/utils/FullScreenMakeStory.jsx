import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { UploadImage } from '../utils/UploadImage'
import { getAuth } from "firebase/auth";
import { toast } from 'react-toastify';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../firebase/firebase'
import Loading from './Loading';

export default function FullScreenMakeStory({ outsideClick, setShowFullScreenMakeStory }) {

    // Import Auth from firebase
    const auth = getAuth()

    // If the user select a Story then the photoURL state send the picture to the UploadImage component
    const [photoURL, setPhotoURL] = useState(null)

    // If loading then the app show the Loading component
    const [loading, setLoading] = useState(false)

    // If the user select a Story then the app show the picture
    const [previewPhoto, setPreviewPhoto] = useState(null)


    // Upload Story if the user click to the Upload button
    function onSubmitProfilePictureUpdate(event) {
        event.preventDefault()
        setLoading(true)
        UploadImage(photoURL, setLoading).then((downloadURL) => {
            addDoc(collection(db, "stories"), {
                author: auth.currentUser.uid,
                photoURL: downloadURL,
                createdAt: Date.now(),
                timestamp: serverTimestamp()
            })
                .then(() => {
                    setLoading(false)
                    toast.success("Story make success!")
                })
                .catch((error) => {
                    setLoading(false)
                    toast.error("Story make error!")
                })
        })
    }

    return (
        loading ? (<Loading />) : (
            <section ref={outsideClick} className='relative flex flex-col justify-center w-[95%] max-w-3xl max-h-[600px] h-full text-white rounded-md shadow-sm bg-[#242527]'>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-[#242527] w-6 h-6 cursor-pointer absolute top-2 right-2"
                    onClick={() => setShowFullScreenMakeStory(false)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <form className='flex flex-col items-center gap-10 mx-auto w-[90%] md:w-[50%]' onSubmit={onSubmitProfilePictureUpdate}>

                    {previewPhoto && (
                        <img
                            src={previewPhoto}
                            alt="Story Photo"
                            className='object-cover object-center w-44 h-44 rounded-md shadow-sm' />
                    )}

                    <Dropzone multiple={false} onDrop={acceptedFiles => {
                        setPreviewPhoto(URL.createObjectURL(acceptedFiles[0]))
                        setPhotoURL(acceptedFiles[0])
                    }}>
                        {({ getRootProps, getInputProps }) => (
                            <section className='bg-[#2a2c2e] hover:bg-[#2b2d30] p-4 w-full rounded-md shadow-sm cursor-pointer text-center'>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} accept='image/jpeg, image/png, image/gif' />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>

                    <button
                        type='submit'
                        className='w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition duration-200 ease-in-out'>
                        Upload
                    </button>

                </form>

            </section>
        )
    )
}
