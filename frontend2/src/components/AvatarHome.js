import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PlayMemories from './PlayMemories';
import '../AvatarHome.css';
import ZeldasLullaby from '../assets/Music/zelda_lullaby.mp3'; // Correct path to the audio file

function AvatarHome() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [avatarName, setAvatarName] = useState('');
    const [avatarProps, setAvatarProps] = useState(null); // Store avatar customization
    const [showPlayMemories, setShowPlayMemories] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false); // Track if the music is playing
    const audioRef = useRef(null); // Create a ref for the audio element

    useEffect(() => {
        document.body.classList.add('avatar-home-page');

        // Create audio element
        const audio = new Audio(ZeldasLullaby);
        audio.loop = true;
        audioRef.current = audio;

        const playAudio = () => {
            audioRef.current.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        };

        const pauseAudio = () => {
            audioRef.current.pause();
        };

        // Check if the page was reloaded
        const navigationType = performance.getEntriesByType('navigation')[0].type;
        if (navigationType !== 'reload') {
            playAudio();
            setIsPlaying(true);
            localStorage.setItem('shouldPlayMusic', 'true');
        } else {
            setIsPlaying(false);
            localStorage.setItem('shouldPlayMusic', 'false');
        }

        // Cleanup function to pause the audio when the component unmounts
        return () => {
            document.body.classList.remove('avatar-home-page');
            pauseAudio();
        };
    }, []);

    useEffect(() => {
        const fetchAvatarData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5001/api/avatars/${id}`, {
                    headers: { 'x-auth-token': token },
                });
                const avatarData = response.data;
                setAvatarName(capitalizeFirstLetter(avatarData.name));

                // Fetch customization data
                const customizationResponse = await axios.get(`http://localhost:5001/api/avatars/${id}/customization`, {
                    headers: { 'x-auth-token': token },
                });
                setAvatarProps(customizationResponse.data);

            } catch (error) {
                console.error('Error fetching avatar data:', error);
            }
        };

        if (id) {
            fetchAvatarData();
        }
    }, [id]);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handlePlayClick = () => {
        setShowPlayMemories(true);
        document.body.classList.add('play-memories-body');
    };

    const handleClosePopup = () => {
        setShowPlayMemories(false);
        document.body.classList.remove('play-memories-body');
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
            localStorage.setItem('shouldPlayMusic', 'false');
        } else {
            audioRef.current.play().catch(error => {
                console.error('Error playing audio:', error);
            });
            localStorage.setItem('shouldPlayMusic', 'true');
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="avatar-home-container">
            <h2 className="avatar-home-title my-4">{avatarName}'s Home</h2>
            <button onClick={togglePlayPause} className="play-pause-button">
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
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1004/1004733.png"
                                alt="Add Avatar"
                                className="avatar-home-add-icon"
                            />
                        </div>
                    )}
                    <div className="avatar-home-camera-icon-container">
                        <img 
                            src="https://icons.iconarchive.com/icons/iconarchive/outline-camera/512/Flat-Red-Big-Camera-icon.png" 
                            alt="Camera Icon" 
                            className="avatar-home-camera-icon" 
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
            </div>
            {showPlayMemories && <PlayMemories avatarId={id} onClose={handleClosePopup} />}
        </div>
    );
}

export default AvatarHome;