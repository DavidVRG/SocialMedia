import { createContext } from 'react';

// Provider in app.jsx
export const AuthContext = createContext({
    loggedIn: null,
    name: null,
    profilePicture: null,
    currentChat: null,
    chats: [],
    newMessage: false,
    newNotification: false,
    notifications: []
});