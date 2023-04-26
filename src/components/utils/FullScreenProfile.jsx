import { getAuth } from 'firebase/auth'
import React from 'react'
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { toast } from 'react-toastify';

export default function FullScreenProfile({ setShowFullScreenProfile, outsideClick, image, name, id }) {

    // Import Auth from firebase
    const auth = getAuth()

    // If the user click to the Create Chat button then the function create a chat
    async function createChat() {
        let hasChat
        const q = query(collection(db, "chat"))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if(doc.data().users.includes(auth.currentUser.uid) && doc.data().users.includes(id)) {
                hasChat = true
            }
        });

        if (auth.currentUser.uid !== id && !hasChat) {
            addDoc(collection(db, "chat"), {
                users: [auth.currentUser.uid, id],
                updatedAt: Date.now(),
                messages: [],
                seen: [auth.currentUser.uid]
            })
                .then(() => {
                    toast.success("Chat create success!")
                })
                .catch((error) => {
                    toast.error("Chat create error!")
                })
        } else {
            toast.error("Chat create error!")
        }
    }

    return (
        <section ref={outsideClick} className='relative flex flex-col items-center justify-center gap-4 w-[95%] max-w-2xl max-h-[600px] h-full text-white rounded-md shadow-sm bg-[#242527]'>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-[#242527] w-6 h-6 cursor-pointer absolute top-2 right-2"
                onClick={() => setShowFullScreenProfile(false)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <img
                src={image}
                alt="Full Screen Image"
                className='object-cover object-center w-80 h-80 rounded-md shadow-sm' />

            <h2 className='text-2xl font-medium'>{name}</h2>

            <button
                onClick={createChat}
                className='w-[50%] bg-blue-600 hover:bg-blue-700 p-2 rounded-md shadow-sm transition ease-in-out duration-200'>
                Create chat
            </button>

        </section>
    )
}
