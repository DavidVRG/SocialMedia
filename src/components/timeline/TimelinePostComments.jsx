import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth'
import { toast } from 'react-toastify'

// Desktop and mobile timeline post comments component
export default function TimelinePostComments({ comment, setShowFullScreenProfile, setFullScreenProfileData, id }) {

  // Import auth from firebase
  const auth = getAuth()

  // If the user click to the text then the app show the full text
  const [wrap, setWrap] = useState(true)

  // Set the author data
  const [authorData, setAuthorData] = useState(null)

  // Triggered by post data
  useEffect(() => {
    async function getAuthorData() {
      const docSnap = await getDoc(doc(db, "users", comment.author))
      setAuthorData(docSnap.data())
    }
    getAuthorData()
  }, [comment])

  // If the user click to the delete on comment
  async function deletePost() {
    const docRef = doc(db, "posts", id)
    const docSnap = await getDoc(docRef)
    const comments = docSnap.data().comments
    const index = comments.findIndex(object => {
      return object.text === comment.text
    })
    comments.splice(index, 1)
    updateDoc(docRef, {
      comments: comments
    })
    .then(() => {
      toast.success("Comment remove success!")
    })
    .catch((error) => {
      toast.error("Something wrong!")
    })
  }

  return (
    authorData && (
      <section className='flex gap-2 mb-4'>

        <div className='w-8 h-8 rounded-full shrink-0'
          onClick={() => {
            setFullScreenProfileData({
              image: authorData.photoURL,
              name: authorData.name,
              id: comment.author
            })
            setShowFullScreenProfile(true)
          }}>
          <img
            src={authorData.photoURL}
            alt={authorData.name}
            className='w-full h-full object-cover object-center rounded-full cursor-pointer' />
        </div>

        <div>
          <div className='bg-[#3b3c41] p-3 text-white rounded-3xl shadow-sm'>
            <span className='block font-medium'>{authorData.name}</span>
            <p className={`${wrap ? "wrap-content" : ""} break-all`}
              onClick={() => setWrap(prevState => !prevState)}>
              {comment.text}
            </p>
          </div>

          {comment.author === auth.currentUser.uid && (
            <button
              onClick={deletePost}
              className='text-gray-300 text-sm font-medium pl-3'>
              Delete
            </button>
          )}
        </div>

      </section>
    )
  )
}