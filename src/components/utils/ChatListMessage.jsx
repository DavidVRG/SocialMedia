import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase/firebase'
import Moment from 'react-moment'

export default function ChatListMessage({ data, id, setComponents, setDropdownMenu, setCurrentChat, seen }) {

    // Import Auth from firebase
    const auth = getAuth()

    // Set the partner data
    const [chatPartner, setChatPartner] = useState(null)

    // Triggered by data
    useEffect(() => {
        async function getAuthorData() {
            let chatPartnerId;
            await data.users.forEach((e) => {
                if (e !== auth.currentUser.uid) {
                    chatPartnerId = e
                }
            })
            const docSnap = await getDoc(doc(db, "users", chatPartnerId))
            setChatPartner(docSnap.data())
        }
        getAuthorData()
    }, [data])

    return (
        chatPartner && (
            <li className={`${seen ? "bg-[#242527] md:bg-[#3b3c41] hover:bg-[#36373b]" : "bg-[#717bc7] md:bg-[#717bc7]"} cursor-pointer w-[95%] mx-auto px-4 py-5 md:px-2 md:py-3 text-white rounded-md shadow-sm transition ease-in-out duration-200`}
                onClick={() => { setCurrentChat(id), setComponents("ChatPage"), (setDropdownMenu && setDropdownMenu(false)) }}>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-1 mb-1'>
                        <div className='w-6 h-6 rounded-full'>
                            <img
                                src={chatPartner.photoURL}
                                alt={chatPartner.name}
                                className='object-cover object-center w-full h-full rounded-full' />
                        </div>
                        <span className='block font-medium'>{chatPartner.name}</span>
                        <span className='text-sm text-green-500'>{!seen && "(new)"}</span>
                    </div>
                    <time>
                        <Moment date={new Date(data.updatedAt)} fromNow />
                    </time>
                </div>
                <p className='wrap-content'>
                    {
                        data.messages.slice().reverse().map((message, index) => {
                            if (index === 0) {
                                return (
                                    message.text
                                )
                            }
                        })
                    }
                </p>
            </li>
        )
    )
}
