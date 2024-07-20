import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../PlayMemories.css';

function PlayMemories({ avatarId, onClose }) {
    const [memories, setMemories] = useState([]);

    useEffect(() => {
        const fetchMemories = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5001/api/avatars/${avatarId}/memories`, {
                    headers: { 'x-auth-token': token },
                });
                console.log('Fetched memories:', response.data.memories); // Log the fetched data
                setMemories(response.data.memories || []); // Ensure response data is an array
            } catch (error) {
                console.error('Error fetching memories:', error);
                setMemories([]); // Set an empty array in case of error
            }
        };

        fetchMemories();

        const track = document.getElementById("image-track");

        const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

        const handleOnUp = () => {
            track.dataset.mouseDownAt = "0";
            track.dataset.prevPercentage = track.dataset.percentage;
        }

        const handleOnMove = e => {
            if (track.dataset.mouseDownAt === "0") return;

            const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
                maxDelta = window.innerWidth / 2;

            const percentage = (mouseDelta / maxDelta) * -100,
                nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
                nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

            track.dataset.percentage = nextPercentage;

            track.animate({
                transform: `translate(${nextPercentage}%, -50%)`
            }, { duration: 1200, fill: "forwards" });

            for (const image of track.getElementsByClassName("image")) {
                image.animate({
                    objectPosition: `${100 + nextPercentage}% center`
                }, { duration: 1200, fill: "forwards" });
            }
        }

        window.onmousedown = e => handleOnDown(e);
        window.ontouchstart = e => handleOnDown(e.touches[0]);

        window.onmouseup = e => handleOnUp(e);
        window.ontouchend = e => handleOnUp(e.touches[0]);

        window.onmousemove = e => handleOnMove(e);
        window.ontouchmove = e => handleOnMove(e.touches[0]);

        return () => {
            window.onmousedown = null;
            window.ontouchstart = null;
            window.onmouseup = null;
            window.ontouchend = null;
            window.onmousemove = null;
            window.ontouchmove = null;
        }
    }, [avatarId]);

    return (
        <div className="play-memories-overlay">
            <div className="play-memories-content">
                <button className="close-button" onClick={onClose}>X</button>
                <div id="image-track" data-mouse-down-at="0" data-prev-percentage="0">
                    {Array.isArray(memories) && memories.length > 0 ? memories.map((memory, index) => (
                        <div key={index} className="memory">
                            <h3>{memory.title}</h3>
                            {Array.isArray(memory.photos) && memory.photos.map((photo, photoIndex) => (
                                <img key={photoIndex} className="image" src={photo} alt={`Memory ${index} Photo ${photoIndex}`} />
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