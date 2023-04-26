import React, { useState } from 'react'
import TimelinePostComments from '../timeline/TimelinePostComments'
import Moment from 'react-moment'
import PostMedia from './PostMedia'
import { getAuth } from 'firebase/auth'
import { LikePost } from './LikePost'
import { WriteComment } from './WriteComment'

// Desktop and mobile full screen image component
export default function FullScreenNotification({ setShowFullScreenNotification, outsideClick, data, authorData }) {

    // Import auth from firebase
    const auth = getAuth()

    // If the user write a comment then the state will set the text value
    const [commentText, setCommentText] = useState("")

    return (
        <article ref={outsideClick} className='relative flex flex-col w-[95%] md:w-full max-w-3xl max-h-[600px] h-full text-white bg-[#242527] p-4 rounded-md shadow-sm overflow-y-scroll'>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="bg-[#242527] w-6 h-6 cursor-pointer absolute top-4 right-4"
                onClick={() => setShowFullScreenNotification(false)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            {/* Author name, picture and time */}
            <div className='flex gap-2 mb-4 cursor-pointer'>
                <div className='w-12 h-12 rounded-full'>
                    <img
                        src={authorData.photoURL}
                        alt={authorData.name}
                        className='object-cover object-center w-full h-full rounded-full' />
                </div>
                <div className='text-white'>
                    <span className='block font-medium'>{authorData.name}</span>
                    <time className='text-sm font-thin text-gray-300'>
                        <Moment date={new Date(data.data.createdAt)} fromNow />
                    </time>
                </div>
            </div>

            <div>
                <PostMedia type={data.data.type} data={data.data} />
            </div>

            {/* Likes count */}
            <div className='flex gap-2 text-gray-300'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white bg-blue-600 p-[3px] rounded-full shadow-sm">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                </svg>
                <div>{data.data.likes.length} likes</div>
            </div>

            <div className='h-[1px] w-full bg-[#2c2d30] my-3' />

            {/* Like and comment */}
            <div className='flex gap-8 text-gray-300'>

                <button className='flex gap-2 cursor-pointer'
                    onClick={() => LikePost(data.id, auth)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                    Like
                </button>

                <button className='flex gap-2'>
                    <label htmlFor={`comment`} className='flex gap-2 cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                        Comment
                    </label>
                </button>

            </div>

            <div className='h-[1px] w-full bg-[#2c2d30] my-3' />

            <div>

                {/* Comment list */}
                <div className='w-full'>
                    {data.data.comments.length !== 0 && data.data.comments.map((comment, index) => {
                        return (
                            <TimelinePostComments key={index} comment={comment} />
                        )
                    })}
                </div>

                {/* Create a new comment */}
                <form className='pt-2' onSubmit={(event) => event.preventDefault()}>
                    <input
                        onKeyDown={(event) => WriteComment(commentText, setCommentText, data.id, auth, event)}
                        className="p-2.5 w-full bg-[#3b3c41] border-none rounded-3xl shadow-sm placeholder-gray-400 text-white focus:outline-none"
                        type="text"
                        name="post"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        id="comment"
                        placeholder="Write a comment!" />
                </form>

            </div>

        </article>
    )
}