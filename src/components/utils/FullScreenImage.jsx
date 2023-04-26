import React from 'react'
import Moment from 'react-moment'

// Desktop and mobile full screen image component
export default function FullScreenImage({ setShowFullscreenImage, outsideClick, image, date }) {
  return (
    <section ref={outsideClick} className='relative flex flex-col text-white rounded-md shadow-sm'>
      <img
        src={image}
        alt="Full Screen Image"
        className='object-contain object-center max-w-5xl max-h-[600px] h-full rounded-md shadow-sm' />

      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-[#242527] w-6 h-6 cursor-pointer absolute top-2 right-2"
        onClick={() => setShowFullscreenImage(false)}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>

      {date && (
        <div className='absolute bottom-2 right-2 bg-[#242527] p-2 rounded-md shadow-sm'>
          <Moment date={date} fromNow />
        </div>
      )}

    </section>
  )
}