import React, { useState } from 'react'
import Profile from '../components/profile/Profile'
import Header from '../components/header/Header'
import MobileNotifications from '../components/mobile/MobileNotifications'
import Stories from '../components/timeline/Stories'
import TimelinePosts from '../components/timeline/TimelinePosts'
import TimelineWritePost from '../components/timeline/TimelineWritePost'
import Videos from '../components/videos/Videos'
import Chat from '../components/chat/Chat'
import MobileChatList from '../components/mobile/MobileChatList'

// Desktop and mobile homepage
export default function Home({ setUser, setCurrentChat }) {

  // If the user select a page then the app show the selected component
  const [components, setComponents] = useState("Timeline")

  return (
    <div>
      <Header setComponents={setComponents} components={components} setCurrentChat={setCurrentChat} />

      {/* Desktop Home Page */}
      <div className={`hidden md:block w-full ${components === "ChatPage" ? "max-w-4xl" : "max-w-2xl"} mx-auto pt-24`}>

        {components === "Timeline" && (
          <main>
            <Stories />
            <TimelineWritePost />
            <TimelinePosts />
          </main>
        )}

        {components === "Videos" && (
          <main>
            <Videos />
          </main>
        )}

        {components === "Profile" && (
          <main>
            <Profile setComponents={setComponents} components={components} setUser={setUser} />
          </main>
        )}

        {components === "ChatPage" && (
          <main>
            <Chat setComponents={setComponents} components={components} />
          </main>
        )}

      </div>

      {/* Mobile Home Page */}
      <div className='block md:hidden w-[95%] mx-auto pt-24'>
        {components === "Timeline" && (
          <main>
            <Stories />
            <TimelineWritePost />
            <TimelinePosts />
          </main>
        )}

        {components === "ChatList" && (
          <main>
            <MobileChatList setComponents={setComponents} components={components} setCurrentChat={setCurrentChat} />
          </main>
        )}

        {components === "ChatPage" && (
          <main>
            <Chat setComponents={setComponents} components={components} />
          </main>
        )}

        {components === "Notifications" && (
          <main>
            <MobileNotifications />
          </main>
        )}

        {components === "Profile" && (
          <main>
            <Profile setComponents={setComponents} components={components} setUser={setUser} />
          </main>
        )}

        {components === "Videos" && (
          <main>
            <Videos />
          </main>
        )}

      </div>

    </div>
  )
}