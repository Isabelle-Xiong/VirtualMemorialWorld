import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../AvatarHome.css';

function AvatarHome() {
    const { id } = useParams();
    const [avatarName, setAvatarName] = useState('');

    useEffect(() => {
        document.body.classList.add('avatar-home-page');
        return () => {
            document.body.classList.remove('avatar-home-page');
        };
    }, []);

    useEffect(() => {
        const fetchAvatarName = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5001/api/avatars/${id}`, {
                    headers: { 'x-auth-token': token },
                });
                setAvatarName(capitalizeFirstLetter(response.data.name));
            } catch (error) {
                console.error('Error fetching avatar name:', error);
            }
        };

        if (id) {
            fetchAvatarName();
        }
    }, [id]);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="container">
            <h2 className="my-4">{avatarName}'s Home</h2>
            <div className="camera-icon-container">
                <img 
                    src="https://icons.iconarchive.com/icons/iconarchive/outline-camera/512/Flat-Red-Big-Camera-icon.png" 
                    alt="Camera Icon" 
                    className="camera-icon" 
                />
                <div className="camera-icon-options">
                    <img 
                        src="https://cdn-icons-png.freepik.com/512/2611/2611312.png" 
                        alt="Play" 
                        className="camera-icon-option" 
                    />
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/1004/1004733.png" 
                        alt="Add" 
                        className="camera-icon-option" 
                    />
                </div>
            </div>
        </div>
    );
}

export default AvatarHome;