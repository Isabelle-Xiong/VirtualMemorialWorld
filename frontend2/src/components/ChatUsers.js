import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faComments } from '@fortawesome/free-solid-svg-icons';
import '../ChatUsers.css'; 

const ChatUsers = () => {
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [friendRequestStatus, setFriendRequestStatus] = useState({});

    useEffect(() => {
        const fetchChatUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5001/api/chat-users', {
                    headers: { 'x-auth-token': token },
                });
                setChatUsers(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching chat users:', error);
            }
        };

        fetchChatUsers();
    }, []);

    const handleUserClick = (userId, username) => {
        setSelectedUser({ userId, username });
    };

    const sendFriendRequest = async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/friend-request', { receiverId: userId }, {
                headers: { 'x-auth-token': token },
            });
            setFriendRequestStatus({ ...friendRequestStatus, [userId]: response.data.message });
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    return (
        <div className="chat-users-container">
            <h2 className="messages-title">Messages</h2>
            <ul className="chat-users-list">
                {chatUsers.map(user => (
                    <li key={user._id} className="chat-user-item">
                        <a href="#" className="username" onClick={() => handleUserClick(user._id, user.username)}>
                            {user.username}
                        </a>
                        <div className="action-buttons">
                            <button
                                className="chat-button"
                                onClick={() => handleUserClick(user._id, user.username)}
                            >
                                <FontAwesomeIcon icon={faComments} /> Chat
                            </button>
                            <button
                                className="friend-request-button"
                                onClick={() => sendFriendRequest(user._id)}
                            >
                                <FontAwesomeIcon icon={faUserFriends} /> Send Friend Request
                            </button>
                            {friendRequestStatus[user._id] && (
                                <span className="friend-request-status">{friendRequestStatus[user._id]}</span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            {selectedUser && (
                <Chat
                    recipientId={selectedUser.userId}
                    recipientUsername={selectedUser.username}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

export default ChatUsers;