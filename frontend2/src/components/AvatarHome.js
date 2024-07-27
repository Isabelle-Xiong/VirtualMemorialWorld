import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PlayMemories from './PlayMemories';
import '../AvatarHome.css';
import ZeldasLullaby from '../assets/Music/zelda_lullaby.mp3';

// Function to strip the prompt from the generated goal text
const stripPrompt = (text, prompt = "Tell me about your goals.") => {
    return text.startsWith(prompt) ? text.slice(prompt.length).trim() : text;
};

function AvatarHome() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [avatarName, setAvatarName] = useState('');
    const [avatarInfo, setAvatarInfo] = useState(null);
    const [avatarProps, setAvatarProps] = useState(null);
    const [showPlayMemories, setShowPlayMemories] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [hoverContent, setHoverContent] = useState(null);
    const audioRef = useRef(null);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const playAudio = async () => {
        try {
            await audioRef.current.play();
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const pauseAudio = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    };

    const fetchAvatarData = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5001/api/avatars/${id}`, {
                headers: { 'x-auth-token': token },
            });
            const avatarData = response.data;
            setAvatarName(capitalizeFirstLetter(avatarData.name));
            setAvatarInfo(avatarData);

            // Fetch customization data
            const customizationResponse = await axios.get(`http://localhost:5001/api/avatars/${id}/customization`, {
                headers: { 'x-auth-token': token },
            });
            setAvatarProps(customizationResponse.data);
        } catch (error) {
            console.error('Error fetching avatar data:', error);
        }
    };

    useEffect(() => {
        document.body.classList.add('avatar-home-page');

        // Initialize audio element
        const audio = new Audio(ZeldasLullaby);
        audio.loop = true;
        audioRef.current = audio;

        // Cleanup function to pause the audio when the component unmounts
        return () => {
            document.body.classList.remove('avatar-home-page');
            pauseAudio();
        };
    }, []);

    useEffect(() => {
        if (id) {
            fetchAvatarData();
        }
    }, [id]);

    const handlePlayClick = () => {
        setShowPlayMemories(true);
        document.body.classList.add('play-memories-body');
    };

    const handleClosePopup = () => {
        setShowPlayMemories(false);
        document.body.classList.remove('play-memories-body');
    };

    const handleShowModal = (content, type) => {
        setModalContent(content);
        setModalType(type);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent(null);
        setModalType(null);
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
        return (
            <div className="goal-dashboard">
                {goals.map((goal, index) => (
                    <div key={index} className="goal-card">
                        <img src="https://cdn-icons-png.flaticon.com/512/4185/4185501.png" className="goal-icon" alt="Goal Icon" />
                        <div className="goal-content">
                            <div className="goal-header">Goal:</div>
                            <p className="goal-text">{stripPrompt(goal.goal)}</p>
                            <div className="goal-status">
                                Progress: <span className={`status-badge status-${goal.status.replace(/\s+/g, '-').toLowerCase()}`}>{goal.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderProgressionLog = (progressionLog) => {
        return (
            <div className="progression-log-list">
                <h3 className="progression-log-header">Progression Log</h3>
                {progressionLog.map((logItem, index) => (
                    <div key={index} className="log-item">
                        <span className="log-date">{new Date(logItem.date).toLocaleDateString()}</span>
                        <span className="log-event">{logItem.event}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="avatar-home-container">
            <h2 className="avatar-home-title my-4">{avatarName}'s Home</h2>
            <button
                onClick={togglePlayPause}
                className={`play-pause-button ${isPlaying ? 'playing' : 'paused'}`}
            >
                {isPlaying ? 'Pause Music' : 'Play Music'}
            </button>
            <div className="avatar-home-content">
                <div className="avatar-home-card">
                    {avatarProps ? (
                        <img
                            src={`https://avataaars.io/?avatarStyle=Circle&topType=${avatarProps.topType}&accessoriesType=${avatarProps.accessoriesType}&hairColor=${avatarProps.hairColor}&facialHairType=${avatarProps.facialHairType}&clotheType=${avatarProps.clotheType}&eyeType=${avatarProps.eyeType}&eyebrowType=${avatarProps.eyebrowType}&mouthType=${avatarProps.mouthType}&skinColor=${avatarProps.skinColor}`}
                            alt="Customized Avatar"
                            className="avatar-home-image"
                            onClick={() => navigate(`/customize-avatar/${id}`)}
                        />
                    ) : (
                        <div className="avatar-home-default" onClick={() => navigate(`/customize-avatar/${id}`)}>
                            {/* Removed add icon image here */}
                        </div>
                    )}
                    <div className="avatar-home-icons-list">
                        <div className="icon-row">
                            <div className="avatar-home-icon-container">
                                <div className="memories-label">Memories</div>
                                <div className="avatar-home-camera-icon-container">
                                    <img
                                        src="https://icons.iconarchive.com/icons/iconarchive/outline-camera/512/Flat-Red-Big-Camera-icon.png"
                                        alt="Camera Icon"
                                        className="avatar-home-camera-icon avatar-home-icon"
                                    />
                                    <div className="avatar-home-camera-icon-options">
                                        <img
                                            src="https://cdn-icons-png.freepik.com/512/2611/2611312.png"
                                            alt="Play"
                                            className="avatar-home-camera-icon-option"
                                            onClick={handlePlayClick}
                                        />
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/1004/1004733.png"
                                            alt="Add"
                                            className="avatar-home-camera-icon-option"
                                            onClick={() => navigate(`/add-memories/${id}`)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="avatar-home-icon-container">
                                <div className="letters-label">Letters</div>
                                <img
                                    src="https://cdn-icons-png.freepik.com/512/3463/3463581.png"
                                    alt="Letters Icon"
                                    className="avatar-home-icon"
                                    onClick={() => navigate(`/avatars/${id}/letters`)} // Navigate to Letters.js
                                />
                            </div>
                        </div>
                        <div className="icon-row">
                            <div className="avatar-home-icon-container">
                                <div className="progression-log-label">Logs</div>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/2779/2779262.png"
                                    alt="Progression Log Icon"
                                    className="avatar-home-icon"
                                    onClick={() => handleShowModal(avatarInfo.progressionLog, 'progressionLog')}
                                />
                            </div>
                            <div className="avatar-home-icon-container">
                                <div className="goal-label">Goals</div>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/4185/4185501.png"
                                    alt="Goal Icon"
                                    className="avatar-home-icon"
                                    onClick={() => handleShowModal(avatarInfo.goals, 'goals')}
                                />
                            </div>
                            <div className="avatar-home-icon-container">
                                <div className="calendar-label">Calendar</div>
                                <img
                                    src="https://i.pinimg.com/originals/6c/62/cd/6c62cd23f22859554b2de1e7d5887484.png"
                                    alt="Calendar Icon"
                                    className="avatar-home-icon"
                                    onClick={() => handleShowModal(avatarInfo.dailyRoutine, 'routine')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showPlayMemories && <PlayMemories avatarId={id} onClose={handleClosePopup} />}

            {showModal && (
                <div className="modal" style={modalStyle}>
                    <div className={`modal-content ${modalType === 'routine' ? 'routine-modal' : ''}`}>
                        <span className={`close ${modalType === 'routine' ? 'routine-close' : ''}`} onClick={handleCloseModal}>&times;</span>
                        {Array.isArray(modalContent) && modalContent.length > 0 ? (
                            modalType === 'goals' ? (
                                renderGoals(modalContent)
                            ) : modalType === 'routine' ? (
                                renderRoutine(modalContent)
                            ) : modalType === 'progressionLog' ? (
                                renderProgressionLog(modalContent)
                            ) : (
                                <p>No details available.</p>
                            )
                        ) : (
                            <p>No details available.</p>
                        )}
                    </div>
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

export default AvatarHome;
