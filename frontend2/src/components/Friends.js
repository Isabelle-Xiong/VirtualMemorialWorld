import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faComments } from '@fortawesome/free-solid-svg-icons';
import '../Friends.css';
import Chat from './Chat';

const Friends = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRequests, setShowRequests] = useState(true);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5001/api/friend-requests', {
                    headers: { 'x-auth-token': token },
                });
                setFriendRequests(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        const fetchAcceptedFriends = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5001/api/friends', {
                    headers: { 'x-auth-token': token },
                });
                setAcceptedFriends(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching accepted friends:', error);
            }
        };

        fetchFriendRequests();
        fetchAcceptedFriends();
    }, []);

    const handleUserClick = (userId, username) => {
        setSelectedUser({ userId, username });
    };

    const handleRequestAction = async (requestId, action) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/friend-request/respond', {
                requestId,
                action
            }, {
                headers: { 'x-auth-token': token },
            });

            setFriendRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));

            if (action === 'accept') {
                const updatedAcceptedFriends = await axios.get('http://localhost:5001/api/friends', {
                    headers: { 'x-auth-token': token },
                });
                setAcceptedFriends(Array.isArray(updatedAcceptedFriends.data) ? updatedAcceptedFriends.data : []);
            }
        } catch (error) {
            console.error(`Error ${action}ing friend request:`, error);
        }
    };

    return (
        <div className="friends-container">
            <h2>Friend Requests</h2>
            <div className="friend-requests-section">
                <button className="toggle-button" onClick={() => setShowRequests(!showRequests)}>
                    <FontAwesomeIcon icon={showRequests ? faChevronUp : faChevronDown} />
                </button>
                {showRequests && (
                    <ul className="friend-requests-list">
                        {friendRequests.map(request => (
                            <li key={request._id} className="friend-request-item">
                                <span>{request.sender.username}</span>
                                <div className="action-buttons">
                                    <button
                                        className="accept-button"
                                        onClick={() => handleRequestAction(request._id, 'accept')}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        className="decline-button"
                                        onClick={() => handleRequestAction(request._id, 'decline')}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <h2>Accepted Friends</h2>
            <div className="accepted-friends-section">
                <ul className="accepted-friends-list">
                    {acceptedFriends.map(friend => (
                        <li key={friend._id} className="accepted-friend-item">
                            <span>{friend.username}</span>
                            <button
                                className="chat-button"
                                onClick={() => handleUserClick(friend._id, friend.username)}
                            >
                                <FontAwesomeIcon icon={faComments} /> Chat
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
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

export default Friends;