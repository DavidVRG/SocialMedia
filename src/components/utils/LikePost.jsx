import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

// Post like component
// If the user click to the like then like the post or delete the like
export async function LikePost(id, auth) {
    let liked = false
    const docRef = doc(db, "posts", id)
    const docSnap = await getDoc(docRef)
    const likesArray = docSnap.data().likes
    await likesArray.map((like) => {
        if (like === auth.currentUser.uid) {
            liked = true
        }
    })
    if (!liked) {
        await updateDoc(docRef, {
            likes: arrayUnion(auth.currentUser.uid)
        }).catch((error) => toast.error("Something wrong!"))
    } else {
        await updateDoc(docRef, {
            likes: arrayRemove(auth.currentUser.uid)
        }).catch((error) => toast.error("Something wrong!"))
    }
}