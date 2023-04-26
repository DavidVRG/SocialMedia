import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

// Story Card
export default function Card({ data }) {

    // Set the author data
    const [authorData, setAuthorData] = useState(null)

    // Triggered by post data
    useEffect(() => {
        async function getAuthorData() {
            const docSnap = await getDoc(doc(db, "users", data.data.author))
            setAuthorData(docSnap.data())
        }
        getAuthorData()
    }, [data])

    return (
        data && authorData && (
            <article className='relative w-full h-44 overflow-hidden rounded-lg shadow-md flex justify-center cursor-pointer'>

                <div className='w-full h-full absolute top-0 left-0 right-0 bottom-0 gradient-hover-effect' />

                <img
                    src={data.data.photoURL}
                    alt={authorData.name}
                    className='object-cover object-center w-full h-full' />

                <span className='absolute block bottom-1 font-medium tracking-wide'>{authorData.name}</span>

            </article>
        )
    )
}
