import React, { useEffect, useState } from 'react'
import Post from '../utils/Post'
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import Loading from '../utils/Loading'

// Desktop and mobile homepage timeline post component
export default function TimelinePosts() {

  // Firebase onSnaphot event set the posts to posts state
  const [posts, setPosts] = useState([])

  // Until the Firebase onSnapshot listener fetching the data then loading set to true
  const [loading, setLoading] = useState(true)

  // Get posts from firebase
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({
          data: doc.data(),
          id: doc.id
        });
      });
      setPosts(posts)
      setLoading(false)
    });
    return () => unsubscribe;
  }, [])


  return (
    loading ? (<Loading />) : (
      <section className='w-full mt-6'>
        {posts.map((post, id) => {
          return (
            <Post key={post.id} commentId={id} data={post.data} type={post.data.type} id={post.id} />
          )
        })}
      </section>
    )
  )
}