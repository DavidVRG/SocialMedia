import React from 'react'

// Loading component
export default function Loading() {
  return (
    <div className='h-screen w-screen overflow-hidden fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center'>
        <img src="./loading.gif" alt="Loading" className='w-24 h-24'/>
    </div>
  )
}
