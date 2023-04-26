import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { UploadImage } from '../utils/UploadImage'
import { getAuth, updateProfile } from "firebase/auth";
import { toast } from 'react-toastify';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase'
import Loading from '../utils/Loading'

export default function UpdateProfilePicture({ setShowUpdateProfilePicture, outsideClick, image, setUser }) {

    // Import auth from firebase
    const auth = getAuth()

    // If loading then the app show the Loading component
    const [loading, setLoading] = useState(false)

    // If the user select a profile picture then the photoURL state send the picture to the UploadImage component
    const [photoURL, setPhotoURL] = useState(null)

    // If the user select a profile picture then the app show the picture
    const [previewPhoto, setPreviewPhoto] = useState(image)

    // Upload profile picture if the user click to the Upload button
    function onSubmitProfilePictureUpdate(event) {
        event.preventDefault()
        setLoading(true)
        UploadImage(photoURL, setLoading).then((downloadURL) => {
            if (downloadURL !== null) {
                updateProfile(auth.currentUser, {
                    photoURL: downloadURL
                })
                    .then(() => {
                        updateDoc(doc(db, "users", auth.currentUser.uid), {
                            photoURL: downloadURL
                        })
                            .then(() => {
                                setUser((prevState) => ({
                                    ...prevState,
                                    photoURL: downloadURL
                                }))
                                setLoading(false)
                                toast.success("Upload success!")
                            })
                            .catch((error) => {
                                setLoading(false)
                                toast.error("Something wrong!")
                            })
                    })
                    .catch((error) => {
                        setLoading(false)
                        toast.error("Something wrong!")
                    })
            } else {
                setLoading(false)
                toast.error("Something wrong!")
            }
        })
    }

    return (
        loading ? (<Loading />) : (
            <section ref={outsideClick} className='relative w-[95%] md:w-full max-w-3xl max-h-[600px] h-full text-white rounded-md shadow-sm bg-[#242527]'>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-[#242527] w-6 h-6 cursor-pointer absolute top-2 right-2"
                    onClick={() => setShowUpdateProfilePicture(false)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>

                <form className='flex flex-col items-center gap-10 mt-24 mx-auto w-[90%] md:w-[50%]' onSubmit={onSubmitProfilePictureUpdate}>

                    {previewPhoto && (
                        <img
                            src={previewPhoto}
                            alt="Profile Photo"
                            className='object-cover object-center w-44 h-44 rounded-md shadow-sm' />
                    )}

                    <Dropzone multiple={false} onDrop={acceptedFiles => {
                        setPreviewPhoto(URL.createObjectURL(acceptedFiles[0]))
                        setPhotoURL(acceptedFiles[0])
                    }}>
                        {({ getRootProps, getInputProps }) => (
                            <section className='bg-[#2a2c2e] hover:bg-[#2b2d30] p-4 w-full rounded-md shadow-sm cursor-pointer text-center'>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
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