import React, { useContext } from 'react'
import ChatListMessage from '../utils/ChatListMessage';
import { AuthContext } from '../../context/AuthContext';

// Mobile chat page component
// If the user click to the chatlist menu the the app show this component.
// This component show the all chats with users.
export default function MobileChatList({ setComponents, setCurrentChat }) {

  // Import userchats from AuthContext
  const { chats } = useContext(AuthContext)

  return (
    <section className='text-white'>
      <h2 className='text-2xl text-center font-medium tracking-wide mb-4'>Chat</h2>

      <ul className='flex flex-col gap-3 h-[70vh] items-center overflow-y-scroll'>

        {chats && (
          chats.map((chat) => {
            return (
              <ChatListMessage key={chat.id} seen={chat.seen} data={chat.data} id={chat.id} setComponents={setComponents} setCurrentChat={setCurrentChat} />
            )
          })
        )}

      </ul>
    </section>
  )
}