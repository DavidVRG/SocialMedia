import React, { useEffect, useState } from 'react'
import Post from '../utils/Post'
import { collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import Loading from '../utils/Loading'

// Desktop and mobile videos page component
export default function Videos() {

    // Firebase onSnaphot event set the posts to posts state
    const [posts, setPosts] = useState([])

    // Until the Firebase onSnapshot listener fetching the data then loading set to true
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), where("type", "==", "VideoPost"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const posts = [];
            querySnapshot.forEach((doc) => {
                posts.push({
                    data: doc.data(),
                    id: doc.id
                })
            })
            setPosts(posts)
            setLoading(false)
        });
        return () => unsubscribe;
    }, [])

    return (
        loading ? (<Loading />) : (
            <section className='text-white'>
                <h2 className='text-2xl text-center font-medium tracking-wide mb-8'>Videos</h2>

                <div className="grid grid-cols-1 place-items-center gap-8">
                    {posts.map((post, id) => {
                        return (
                            <Post key={post.id} commentId={id} data={post.data} type={post.data.type} id={post.id} />)
                    })}
                </div>
            </section>
        )
    )
}