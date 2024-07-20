import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../PlayMemories.css';

function PlayMemories({ avatarId, onClose }) {
    const [memories, setMemories] = useState([]);
    const trackRef = useRef(null);

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

        fetchMemories();

        const handleOnDown = e => {
            if (trackRef.current) {
                trackRef.current.dataset.mouseDownAt = e.clientX;
            }
        };

        const handleOnUp = () => {
            if (trackRef.current) {
                trackRef.current.dataset.mouseDownAt = "0";
                trackRef.current.dataset.prevPercentage = trackRef.current.dataset.percentage;
            }
        };

        const handleOnMove = e => {
            if (trackRef.current) {
                if (trackRef.current.dataset.mouseDownAt === "0") return;

                const mouseDelta = parseFloat(trackRef.current.dataset.mouseDownAt) - e.clientX,
                    maxDelta = window.innerWidth / 2;

                const percentage = (mouseDelta / maxDelta) * -100,
                    nextPercentageUnconstrained = parseFloat(trackRef.current.dataset.prevPercentage || 0) + percentage,
                    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

                trackRef.current.dataset.percentage = nextPercentage;

                trackRef.current.animate({
                    transform: `translate(${nextPercentage}%, -50%)`
                }, { duration: 1200, fill: "forwards" });

                for (const image of trackRef.current.getElementsByClassName("image")) {
                    image.animate({
                        objectPosition: `${100 + nextPercentage}% center`
                    }, { duration: 1200, fill: "forwards" });
                }
            }
        };

        window.addEventListener('mousedown', handleOnDown);
        window.addEventListener('touchstart', (e) => handleOnDown(e.touches[0]));
        window.addEventListener('mouseup', handleOnUp);
        window.addEventListener('touchend', (e) => handleOnUp(e.touches[0]));
        window.addEventListener('mousemove', handleOnMove);
        window.addEventListener('touchmove', (e) => handleOnMove(e.touches[0]));

        return () => {
            window.removeEventListener('mousedown', handleOnDown);
            window.removeEventListener('touchstart', (e) => handleOnDown(e.touches[0]));
            window.removeEventListener('mouseup', handleOnUp);
            window.removeEventListener('touchend', (e) => handleOnUp(e.touches[0]));
            window.removeEventListener('mousemove', handleOnMove);
            window.removeEventListener('touchmove', (e) => handleOnMove(e.touches[0]));
        };
    }, [avatarId]);

    return (
        <div className="play-memories-overlay">
            <div className="play-memories-content">
                <button className="close-button" onClick={onClose}>X</button>
                <div id="image-track" ref={trackRef} data-mouse-down-at="0" data-prev-percentage="0">
                    {Array.isArray(memories) && memories.length > 0 ? memories.map((memory, index) => (
                        <div key={index} className="memory">
                            <h3>{memory.title}</h3>
                            {Array.isArray(memory.photos) && memory.photos.map((photo, photoIndex) => (
                                <img key={photoIndex} className="image" src={photo} alt={`Memory ${index} Photo ${photoIndex}`} draggable="false" />
                            ))}
                            {memory.soundtrack && (
                                <div className="soundtrack">
                                    <h4>Soundtrack</h4>
                                    <audio controls>
                                        <source src={memory.soundtrack} />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}
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