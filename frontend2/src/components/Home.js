import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faBullseye, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import '../Home.css';
import useVirtualTime from '../hooks/useVirtualTime'; // Import the custom hook
import Chat from './Chat';
import { useNavigate } from 'react-router-dom';

// Function to strip the prompt from the generated goal text
const stripPrompt = (text, prompt = "Tell me about your goals.") => {
    return text.startsWith(prompt) ? text.slice(prompt.length).trim() : text;
};

function Home({ speedMultiplier }) {
    const { virtualDay, setVirtualDay } = useVirtualTime(speedMultiplier); // Destructure from hook
    const [avatars, setAvatars] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalType, setModalType] = useState(null); // Add modalType state
    const [hoverContent, setHoverContent] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    const fetchAvatars = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }
        try {
            const response = await axios.get('http://localhost:5001/api/avatars', {
                headers: { 'x-auth-token': token },
            });
            console.log('Fetched avatars:', response.data); // Debug log
            setAvatars(response.data);
        } catch (error) {
            console.error('Error fetching avatars:', error);
        }
    };

    useEffect(() => {
        document.body.classList.add('home-page');
        return () => {
            document.body.classList.remove('home-page');
        };
    }, []);

    useEffect(() => {
        fetchAvatars();
    }, []); // Fetch avatars once on component mount

    useEffect(() => {
        fetchAvatars();
    }, [virtualDay]); // Re-fetch avatars every new virtual day

    const deleteAvatar = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5001/api/avatars/${id}`, {
                headers: { 'x-auth-token': token },
            });
            setAvatars(avatars.filter((avatar) => avatar._id !== id));
        } catch (error) {
            console.error('Error deleting avatar:', error);
        }
    };

    const handleUserClick = (userId, username) => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            if (decodedToken.userId === userId) {
                console.error("You cannot chat with yourself.");
                return;
            }
        }
        setSelectedUser({ userId, username });
    };

    const handleShowModal = (content, type) => {
        setModalContent(content);
        setModalType(type);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent(null);
        setModalType(null); // Reset modal type
    };

    const handleHoverContent = (content) => {
        setHoverContent(content);
    };

    const handleLeaveHover = () => {
        setHoverContent(null);
    };

    const renderRoutine = (dailyRoutine) => {
        return (
            <div className="routine-list">
                <h3 className="routine-header">My Schedule</h3>
                {dailyRoutine.map((routineItem, index) => (
                    <div key={index} className="routine-item">
                        <span className="routine-time">{routineItem.time}</span>
                        <span className="routine-event">{routineItem.event}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderGoals = (goals) => {
        return goals.map((goal, index) => (
            <div key={index} className="goal-card">
                <p><strong>Goal:</strong> {stripPrompt(goal.goal)}</p>
                <p><strong>Status:</strong> {goal.status}</p>
            </div>
        ));
    };

    const renderRelationships = (relationships) => {
        return relationships.map((relationship, index) => (
            <div key={index} className="relationship-card">
                <p><strong>Type:</strong> {relationship.type}</p>
                <p><strong>Name:</strong> {relationship.name}</p>
                {relationship.details && relationship.details.gender && <p><strong>Gender:</strong> {relationship.details.gender}</p>}
                {relationship.details && relationship.details.age && <p><strong>Age:</strong> {relationship.details.age}</p>}
                {relationship.details && relationship.details.birthday && <p><strong>Birthday:</strong> {new Date(relationship.details.birthday).toLocaleDateString()}</p>}
                <p><strong>Since:</strong> {new Date(relationship.since).toLocaleDateString()}</p>
            </div>
        ));
    };

    const renderJobs = (jobs) => {
        return jobs.map((job, index) => (
            <div key={index} className="job-card">
                <p><strong>Title:</strong> {job.title}</p>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Start Date:</strong> {new Date(job.startDate).toLocaleDateString()}</p>
                {job.endDate && <p><strong>End Date:</strong> {new Date(job.endDate).toLocaleDateString()}</p>}
                {job.isCurrent && <p><strong>Current Job:</strong> Yes</p>}
            </div>
        ));
    };
    return (
        <div className="home-container">
            <h2 className="my-4 avatars-title">Avatars</h2>
            <div className="avatars-container">
                {Array.isArray(avatars) && avatars.length > 0 ? (
                    avatars.map((avatar) => (
                        <div key={avatar._id} className="avatar-card">
                            <button className="edit-button" onClick={() => window.location.href = `/edit-avatar/${avatar._id}`}>Edit</button>
                            <button className="release-button" onClick={() => deleteAvatar(avatar._id)}>Release</button>
                            <div className="avatar-header">
                                <a href="#" className="avatar-creator" onClick={() => handleUserClick(avatar.userId?._id, avatar.userId?.username)}>
                                    {avatar.userId?.username}
                                </a>
                                {/* <img src={avatar.picture} alt={avatar.name} className="avatar-picture" /> */}
                                <div className="avatar-picture-container">
                                    <img
                                        src={avatar.picture}
                                        alt={avatar.name}
                                        className="avatar-picture"
                                        onClick={() => navigate(`/avatar-home/${avatar._id}`)}
                                    />
                                </div>
                                <h5 className="avatar-name">{avatar.name}</h5>
                            </div>
                            <div className="avatar-details">
                                <p><strong>Age:</strong> {avatar.age}</p>
                                <p><strong>Hobbies:</strong> {avatar.hobbies}</p>
                                <p><strong>Education:</strong> {avatar.education}</p>
                                <p><strong>Marital Status:</strong> {avatar.maritalStatus}</p>
                                <p><strong>Personality:</strong> {avatar.personality}</p>
                                <p><strong>Special Notes:</strong> {avatar.specialNotes}</p>
                                <div className="button-group">
                                    <button className="button-group-btn" onClick={() => handleShowModal(avatar.relationships, 'relationships')}>Relationships</button>
                                    <button className="button-group-btn" onClick={() => handleShowModal(avatar.jobs, 'jobs')}>Career</button>
                                </div>
                            </div>
                            <div className="avatar-icons">
                                <FontAwesomeIcon icon={faLightbulb} className="icon" onMouseEnter={() => handleHoverContent(avatar.progressionLog)} onMouseLeave={handleLeaveHover} />
                                <FontAwesomeIcon icon={faBullseye} className="icon" onClick={() => handleShowModal(avatar.goals, 'goals')} />
                                <FontAwesomeIcon icon={faCalendarAlt} className="icon" onClick={() => handleShowModal(avatar.dailyRoutine, 'routine')} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No avatars found.</p>
                )}
            </div>

            {showModal && (
                <div className="modal" style={modalStyle}>
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        {Array.isArray(modalContent) && modalContent.length > 0 ? (
                            modalType === 'relationships' ? (
                                renderRelationships(modalContent)
                            ) : modalType === 'jobs' ? (
                                renderJobs(modalContent)
                            ) : modalType === 'goals' ? (
                                renderGoals(modalContent)
                            ) : modalType === 'routine' ? (
                                renderRoutine(modalContent)
                            ) : (
                                <p>No details available.</p>
                            )
                        ) : (
                            <p>No details available.</p>
                        )}
                    </div>
                </div>
            )}

            {hoverContent && (
                <div className="hover-content" style={hoverStyle}>
                    {Array.isArray(hoverContent) && hoverContent.length > 0 ? (
                        hoverContent.map((item, index) => (
                            <div key={index}>
                                {Object.entries(item).map(([key, value]) => (
                                    <p key={key}><strong>{key}:</strong> {value}</p>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>No details available.</p>
                    )}
                </div>
            )}
            {selectedUser && (
    <div className="home-chat-container">
        <Chat
            recipientId={selectedUser.userId}
            recipientUsername={selectedUser.username}
            onClose={() => setSelectedUser(null)}
        />
    </div>
)}
        </div>
    );
}

const modalStyle = {
    display: 'block',
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
};

const hoverStyle = {
    position: 'absolute',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    padding: '10px',
    zIndex: 2,
};

export default Home