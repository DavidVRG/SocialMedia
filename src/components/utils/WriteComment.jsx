import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";

// Write Comment function component
export async function WriteComment(commentText, setCommentText, id, auth, event) {
    if(event.key === "Enter") {
        const docRef = doc(db, "posts", id)
        await updateDoc(docRef, {
            seen: [auth.currentUser.uid],
            updatedAt: Date.now(),
            comments: arrayUnion({
                author: auth.currentUser.uid,
                text: commentText
            })
        }).catch((error) => toast.error("Something wrong!"))
        setCommentText("")
    }
}
