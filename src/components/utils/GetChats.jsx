import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';
import { AuthStatus } from '../auth/AuthStatus';

export function GetChats() {

    // Import Auth from firebase
    const auth = getAuth()

    // Import loggedIn state from AuthStatus
    const { loggedIn } = AuthStatus()

    // All chats state
    const [chats, setChats] = useState([])

    // New message boolean state
    const [newMessage, setNewMessage] = useState(false)

    // Get chat datas and the message alert trigger the mobile screen too
    useEffect(() => {
        if (loggedIn) {
            const q = query(collection(db, "chat"), orderBy("updatedAt", "desc"), where("users", "array-contains", auth.currentUser.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const chats = [];
                let newMessage = false;
                querySnapshot.forEach((doc) => {
                    if (!doc.data().seen.includes(auth.currentUser.uid)) {
                        newMessage = true
                        chats.push({
                            data: doc.data(),
                            id: doc.id,
                            seen: false
                        })
                    } else {
                        chats.push({
                            data: doc.data(),
                            id: doc.id,
                            seen: true
                        })
                    }
                })
                setNewMessage(newMessage)
                setChats(chats)
            });
            return () => unsubscribe;
        }
    }, [loggedIn])

    return { chats, newMessage }
}
