import React, { useEffect, useRef, useState } from 'react'
import PreviousComment from './PreviousComment'
import { WriteComment } from './WriteComment'
import EmojiPicker from 'emoji-picker-react'

// Desktop and mobile previous comments component
export default function PreviousComments({ data, auth, id, setShowPreviousComments, outsideClick }) {

  // Ref for outsideclick
  const ref = useRef()

  // If the user click to the emoji the the app show the emoji picker component
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // If the user write a comment then the state will set the text value
  const [commentText, setCommentText] = useState("")

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

  return (
    <section ref={outsideClick} className='flex flex-col w-[95%] md:w-full max-w-xl max-h-[600px] h-full text-white bg-[#242527] rounded-md shadow-sm p-4'>

      {/* Title and exit */}
      <div className='w-full flex justify-between pb-4'>

        <h2 className="text-xl font-medium">Previous Comments</h2>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer"
          onClick={() => setShowPreviousComments(false)}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>

      </div>

      {/* Previous comments */}
      <div className='w-full h-full overflow-y-scroll'>

        {data.comments.map((comment, index) => {
          return (
            <PreviousComment key={index} id={id} comment={comment} />
          )
        })}

      </div>

      {/* Create a new comment */}
      <form className='pt-2 relative' onSubmit={(event) => event.preventDefault()}>

        <div className="relative flex items-center">
          <input
            onKeyDown={(event) => WriteComment(commentText, setCommentText, id, auth, event)}
            className="p-2.5 w-full bg-[#3b3c41] border-none rounded-3xl shadow-sm placeholder-gray-400 text-white focus:outline-none"
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            name="post"
            id="comment"
            placeholder="Write a comment!" />

          <div onClick={() => setShowEmojiPicker(prevState => !prevState)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute top-2.5 right-2.5 w-6 h-6 cursor-pointer text-gray-300 hover:text-gray-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </div>
        </div>

        <div ref={ref} className={`absolute z-50 bottom-12 md:bottom-8 right-3.5 md:right-8 transition-all duration-500 ${showEmojiPicker ? "visible opacity-100" : "invisible opacity-0"}`}>
          {showEmojiPicker && (
            <EmojiPicker
              width={300}
              height={300}
              theme='dark'
              searchDisabled={true}
              lazyLoadEmojis={true}
              onEmojiClick={(emojiObject) => setCommentText((prevMsg) => prevMsg + emojiObject.emoji)} />
          )}
        </div>

      </form>

    </section>
  )
}