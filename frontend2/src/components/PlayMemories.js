import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../PlayMemories.css';

function PlayMemories({ avatarId, onClose }) {
    const [memories, setMemories] = useState([]);
    const [soundtracks, setSoundtracks] = useState([]);
    const [currentSoundtrackIndex, setCurrentSoundtrackIndex] = useState(0);
    const trackRef = useRef(null);
    const audioRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchMemories = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5001/api/avatars/${avatarId}/memories`, {
                    headers: { 'x-auth-token': token },
                });
                console.log('Fetched memories:', response.data.memories);
                setMemories(response.data.memories || []);
            } catch (error) {
                console.error('Error fetching memories:', error);
                setMemories([]);
            }
        };

        const fetchSoundtracks = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5001/api/avatars/${avatarId}/soundtracks`, {
                    headers: { 'x-auth-token': token },
                });
                console.log('Fetched soundtracks:', response.data.soundtracks);
                setSoundtracks(response.data.soundtracks || []);
            } catch (error) {
                console.error('Error fetching soundtracks:', error);
                setSoundtracks([]);
            }
        };

        fetchMemories();
        fetchSoundtracks();

        const handleOnDown = e => {
            if (trackRef.current) {
                trackRef.current.dataset.mouseDownAt = e.clientX;
                clearInterval(intervalRef.current);
            }
        };

        const handleOnUp = () => {
            if (trackRef.current) {
                trackRef.current.dataset.mouseDownAt = "0";
                trackRef.current.dataset.prevPercentage = trackRef.current.dataset.percentage;
                startLoop();
            }
        };

        const handleOnMove = e => {
            if (trackRef.current) {
                if (trackRef.current.dataset.mouseDownAt === "0") return;

                const mouseDelta = parseFloat(trackRef.current.dataset.mouseDownAt) - e.clientX,
                    maxDelta = window.innerWidth / 2;

                const percentage = (mouseDelta / maxDelta) * -100,
                    nextPercentageUnconstrained = parseFloat(trackRef.current.dataset.prevPercentage || 0) + percentage,
                    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -200); // Adjust to -200 for loop

                trackRef.current.dataset.percentage = nextPercentage;

                trackRef.current.style.transform = `translate(${nextPercentage}%, -50%)`;

                for (const image of trackRef.current.getElementsByClassName("play-memories-image")) {
                    image.style.objectPosition = `${100 + nextPercentage}% center`;
                }

                if (nextPercentage <= -100) {
                    trackRef.current.dataset.percentage = "0";
                    trackRef.current.dataset.prevPercentage = "0";
                    trackRef.current.style.transform = `translate(0%, -50%)`;
                }
            }
        };

        window.addEventListener('mousedown', handleOnDown);
        window.addEventListener('touchstart', (e) => handleOnDown(e.touches[0]));
        window.addEventListener('mouseup', handleOnUp);
        window.addEventListener('touchend', (e) => handleOnUp(e.touches[0]));
        window.addEventListener('mousemove', handleOnMove);
        window.addEventListener('touchmove', (e) => handleOnMove(e.touches[0]));

        const startLoop = () => {
            intervalRef.current = setInterval(() => {
                if (trackRef.current) {
                    let currentPercentage = parseFloat(trackRef.current.dataset.percentage) || 0;
                    let nextPercentage = currentPercentage - 0.1;
                    if (nextPercentage <= -100) {
                        nextPercentage = 0;
                    }
                    trackRef.current.dataset.percentage = nextPercentage;

                    trackRef.current.style.transform = `translate(${nextPercentage}%, -50%)`;
                    for (const image of trackRef.current.getElementsByClassName("play-memories-image")) {
                        image.style.objectPosition = `${100 + nextPercentage}% center`;
                    }
                }
            }, 50);
        };

        startLoop();

        return () => {
            window.removeEventListener('mousedown', handleOnDown);
            window.removeEventListener('touchstart', (e) => handleOnDown(e.touches[0]));
            window.removeEventListener('mouseup', handleOnUp);
            window.removeEventListener('touchend', (e) => handleOnUp(e.touches[0]));
            window.removeEventListener('mousemove', handleOnMove);
            window.removeEventListener('touchmove', (e) => handleOnMove(e.touches[0]));
            clearInterval(intervalRef.current);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [avatarId]);

    useEffect(() => {
        if (soundtracks.length > 0 && audioRef.current) {
            audioRef.current.src = soundtracks[currentSoundtrackIndex];
            audioRef.current.play();
            audioRef.current.onended = () => {
                setCurrentSoundtrackIndex((prevIndex) => (prevIndex + 1) % soundtracks.length);
            };
        }
    }, [soundtracks, currentSoundtrackIndex]);

    const duplicateMemories = (memories) => {
        return [...memories, ...memories];
    };

    const duplicatedMemories = duplicateMemories(memories);

    return (
        <div className="play-memories-overlay">
            <div className="play-memories-content">
                <button className="play-memories-close-button" onClick={onClose}>X</button>
                <audio ref={audioRef} style={{ display: 'none' }} />
                <div id="play-memories-image-track" ref={trackRef} data-mouse-down-at="0" data-prev-percentage="0">
                    {Array.isArray(duplicatedMemories) && duplicatedMemories.length > 0 ? duplicatedMemories.map((memory, index) => (
                        <div key={index} className="play-memories-memory">
                            <h3 className="play-memories-memory-title">{memory.title}</h3>
                            <div className="play-memories-memory-photos">
                                {Array.isArray(memory.photos) && memory.photos.map((photo, photoIndex) => (
                                    <img key={photoIndex} className="play-memories-image" src={photo} alt={`Memory ${index} Photo ${photoIndex}`} draggable="false" />
                                ))}
                            </div>
                        </div>
                    )) : (
                        <p>No memories available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PlayMemories;