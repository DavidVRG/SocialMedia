import React, { useContext } from 'react'
import ChatListMessage from '../utils/ChatListMessage';
import { AuthContext } from '../../context/AuthContext';

// Desktop chat dropdown menu component
// If the user click to the chatlist dropdown menu the the app show this component.
// This component show the all chats with users.
export default function DesktopChatList({ dropdownMenu, setDropdownMenu, setComponents, setCurrentChat }) {

    // Import userchats from AuthContext
    const { chats, newMessage } = useContext(AuthContext)

    return (
        <section className="relative w-10 h-10 rounded-full bg-[#3a3b3d] hover:bg-[#424346] transition ease-in-out duration-200 flex items-center justify-center">

            {newMessage && <div className="h-4 w-4 rounded-full bg-green-500 absolute bottom-0 -right-1" />}

            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full p-2 cursor-pointer"
                    onClick={() => {
                        dropdownMenu === "chat" ? setDropdownMenu("") : setDropdownMenu("chat")
                    }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
            </div>

            <div className={`absolute right-0 top-10 z-10 mt-2 w-[350px] origin-top-right rounded-md bg-[#242527] text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ${dropdownMenu === "chat" ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className='flex items-center justify-between px-4 py-2'>
                    <div className='text-xl font-medium'>Chat</div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                        onClick={() => {
                            dropdownMenu === "chat" ? setDropdownMenu("") : setDropdownMenu("chat")
                        }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <ul className="py-1 flex flex-col gap-3 overflow-y-scroll h-80">

                    {chats && (
                        chats.map((chat) => {
                            return (
                                <ChatListMessage key={chat.id} data={chat.data} seen={chat.seen} id={chat.id} setComponents={setComponents} setDropdownMenu={setDropdownMenu} setCurrentChat={setCurrentChat} />
                            )
                        })
                    )}

                </ul>
            </div>

        </section>
    )
}