import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import '../Navigation.css';

function Navigation() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [chatUsers, setChatUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchChatUsers(token);
        }
    }, []);

    const fetchChatUsers = async (token) => {
        try {
            const response = await axios.get('http://localhost:5001/api/chat-users', {
                headers: { 'x-auth-token': token },
            });
            console.log('Chat users response:', response.data);
            setChatUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching chat users:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Virtual Memorial World</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/avatar">Create Avatar</Link>
                        </li>
                        {isLoggedIn && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={() => navigate('/friends')}>
                                        <FontAwesomeIcon icon={faUserFriends} />
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={() => navigate('/chat-users')}>
                                        <FontAwesomeIcon icon={faComments} />
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;