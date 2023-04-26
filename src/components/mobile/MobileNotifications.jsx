import React, { useContext } from 'react'
import Notification from '../utils/Notification'
import { AuthContext } from '../../context/AuthContext'

// Mobile notifications page component
// If the user click to the notifications menu the the app show this component.
// This component show the all notifications from users.
export default function MobileNotifications() {

  // Import notifications from AuthContext
  const { notifications } = useContext(AuthContext)

  return (
    <section className='text-white'>
      <h2 className='text-2xl text-center font-medium tracking-wide mb-4'>Notifications</h2>

      <ul className='h-[70vh] flex flex-col items-center overflow-y-scroll'>
        {notifications && (
          notifications.map((notification) => {
            return (
              <Notification key={notification.id} data={notification} />
            )
          })
        )}
      </ul>
    </section>
  )
}
