import React, { useEffect, useState } from 'react'
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';
import { AuthStatus } from '../auth/AuthStatus';

export function GetNotifications() {

    // Import Auth from firebase
    const auth = getAuth()

    // Import loggedin state from AuthStatus
    const { loggedIn } = AuthStatus()

    // Firebase onSnaphot event set the posts to notifications state
    const [notifications, setNotifications] = useState([])

    // New notification boolean state
    const [newNotification, setNewNotification] = useState(false)

    useEffect(() => {
        if (loggedIn) {
            const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const notificationsArray = [];
                let newNotification = false;
                querySnapshot.forEach((doc) => {
                    if (doc.data().comments.length === 0) {
                        notificationsArray.push({
                            type: "post",
                            id: doc.id,
                            data: doc.data(),
                            seen: doc.data().seen.includes(auth.currentUser.uid) ? true : false
                        })
                        if (!doc.data().seen.includes(auth.currentUser.uid)) {
                            newNotification = true
                        }
                    } else {
                        notificationsArray.push({
                            type: "comment",
                            id: doc.id,
                            data: doc.data(),
                            seen: doc.data().seen.includes(auth.currentUser.uid) ? true : false
                        })
                        if (!doc.data().seen.includes(auth.currentUser.uid)) {
                            newNotification = true
                        }
                    }
                });
                setNotifications(notificationsArray)
                setNewNotification(newNotification)
            });
            return () => unsubscribe;
        }
    }, [loggedIn])

    return { notifications, newNotification }
}
