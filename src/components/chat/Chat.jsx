import React, { useContext, useEffect, useRef, useState } from 'react'
import { arrayUnion, collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth'
import Moment from 'react-moment'
import EmojiPicker from 'emoji-picker-react'
import { AuthContext } from '../../context/AuthContext'

// This component render the chat messages between two users
export default function Chat({ setComponents }) {

    // Import currentChat from AuthContext
    const { currentChat } = useContext(AuthContext)
 
    // Ref for scroll to bottom
    const bottomRef = useRef(null)
    
    // Ref for outside click
    const ref = useRef(null)

    // Import auth from firebase
    const auth = getAuth()
    
    // New message text 
    const [text, setText] = useState("")

    // Firebase onSnaphot event set the posts to posts state
    const [chatData, setChatData] = useState(null)

    // If the user click to the emoji the the app show the emoji picker component
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    // UseEffect set the chatPartner data
    const [chatPartner, setChatPartner] = useState(null)

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

    // Get current chat from firebase
    useEffect(() => {
        if (currentChat) {
            const q = query(collection(db, "chat"), orderBy("updatedAt", "desc"), where("users", "array-contains", auth.currentUser.uid))
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === currentChat) {
                        setChatData(doc.data())
                    }
                });
            });

            const docRef = doc(db, "chat", currentChat)
            updateDoc(docRef, {
                seen: arrayUnion(auth.currentUser.uid)
            }).catch((error) => toast.error("Something wrong!"))

            return () => unsubscribe;
        }
    }, [currentChat])

    // Get message authordata from firebase
    useEffect(() => {
        async function getAuthorData() {
            let chatPartnerId;
            await chatData.users.forEach((e) => {
                if (e !== auth.currentUser.uid) {
                    chatPartnerId = e
                }
            })
            const docSnap = await getDoc(doc(db, "users", chatPartnerId))
            setChatPartner(docSnap.data())
        }
        chatData && getAuthorData()
    }, [chatData])

    // Scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatData, chatPartner])

    // Send a new message
    async function sendMessage(event) {
        event.preventDefault()
        const docRef = doc(db, "chat", currentChat)
        await updateDoc(docRef, {
            updatedAt: Date.now(),
            messages: arrayUnion({
                author: auth.currentUser.uid,
                text: text,
                createdAt: Date.now()
            }),
            seen: [auth.currentUser.uid]
        }).catch((error) => toast.error("Something wrong!"))
        setText("")
    }

    return (
        <section className='flex flex-col gap-6'>
            {chatPartner && (
                <div className='-mt-5 md:mt-0 h-[70px] w-full flex justify-between items-center bg-[#242527] p-4 rounded-md shadow-sm text-white'>

                    {/* This is the back button that navigate to Timeline */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer"
                        onClick={() => setComponents("Timeline")}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>


                    <h2 className='text-xl text-white font-medium'>{chatPartner.name}</h2>

                    <div className='w-10 h-10 rounded-full'>
                        <img
                            src={chatPartner.photoURL}
                            alt={chatPartner.name}
                            className='object-cover object-center w-full h-full rounded-full' />
                    </div>

                </div>
            )}

            <ul className='h-[60vh] sm:h-[50vh] lg:h-[60vh] w-full flex flex-col gap-4 overflow-y-scroll'>
                {(chatData && chatPartner) && (
                    chatData.messages.map((message, index) => {
                        return (
                            <li className="w-[98%] mx-auto bg-[#242527] md:bg-[#3b3c41] px-4 py-5 md:px-2 md:py-3 text-white rounded-md shadow-sm transition ease-in-out duration-200 hover:bg-[#36373b]"
                                key={index}>
                                <div className='flex justify-between'>
                                    <div className='flex items-center gap-1 mb-1'>
                                        <div className='w-6 h-6 rounded-full'>
                                            <img
                                                src={message.author === auth.currentUser.uid ? auth.currentUser.photoURL : chatPartner.photoURL}
                                                alt={message.author === auth.currentUser.uid ? auth.currentUser.displayName : chatPartner.name}
                                                className='object-cover object-center w-full h-full rounded-full' />
                                        </div>
                                        <span className='block font-medium'>{message.author === auth.currentUser.uid ? auth.currentUser.displayName : chatPartner.name}</span>
                                    </div>
                                    <time>
                                        <Moment date={new Date(message.createdAt)} fromNow />
                                    </time>
                                </div>
                                <p>{message.text}</p>
                            </li>
                        )
                    })
                )}
                <div ref={bottomRef} />
            </ul>

            <form className='relative flex items-center bg-[#3b3c41] rounded-lg' onSubmit={sendMessage}>

                <div ref={ref} className={`absolute z-50 bottom-12 md:bottom-10 right-14 md:right-16 transition-all duration-500 ${showEmojiPicker ? "visible opacity-100" : "invisible opacity-0"}`}>
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

                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    name="message"
                    id="message"
                    placeholder='Write a message'
                    className="p-3 w-full bg-[#3b3c41] border-none rounded-bl-lg rounded-tl-lg shadow-sm placeholder-gray-400 text-white focus:outline-none" />

                <div onClick={() => setShowEmojiPicker(prevState => !prevState)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer mr-1 text-gray-300 hover:text-gray-200 bg-[#3b3c41]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                    </svg>
                </div>

                <button
                    type="submit"
                    className='p-3 bg-[#3b3c41] rounded-tr-lg rounded-br-lg text-white hover:bg-[#333438] transition duration-200 ease-in-out'>
                    Send
                </button>
            </form>

        </section>
    )
}