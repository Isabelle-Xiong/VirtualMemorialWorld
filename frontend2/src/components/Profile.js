import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Profile.css'; // Ensure this line includes the CSS file

function Profile() {
    const [profile, setProfile] = useState(null);
    const [avatars, setAvatars] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Log to confirm token is present
            try {
                const userResponse = await axios.get('http://localhost:5001/api/profile', {
                    headers: { 'x-auth-token': token }
                });
                console.log('Profile response:', userResponse.data); // Log the response
                setProfile(userResponse.data);

                const avatarResponse = await axios.get('http://localhost:5001/api/user-avatars', {
                    headers: { 'x-auth-token': token }
                });
                console.log('Avatars response:', avatarResponse.data); // Log the response
                if (Array.isArray(avatarResponse.data)) {
                    setAvatars(avatarResponse.data);
                } else {
                    console.error('Avatars response is not an array:', avatarResponse.data);
                }
            } catch (error) {
                console.error('Error fetching profile or avatars:', error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2 className="profile-title">Profile</h2>
            <div className="profile-info">
                <h5 className="profile-username">Username: {profile.username}</h5>
                <p className="profile-email">Email: {profile.email}</p>
            </div>
            <h4 className="avatars-title">Avatars Created</h4>
            <div className="profile-avatars-container">
                {avatars.length > 0 ? (
                    avatars.map((avatar) => (
                        <div key={avatar._id} className="profile-avatar-card">
                            <img src={avatar.picture} className="profile-avatar-img" alt={avatar.name} />
                            <div className="profile-avatar-info">
                                <h5 className="profile-avatar-name">{avatar.name}</h5>
                                <p className="profile-avatar-text"><strong>Age:</strong> {avatar.age}</p>
                                <p className="profile-avatar-text"><strong>Hobbies:</strong> {avatar.hobbies.join(', ')}</p>
                                <p className="profile-avatar-text"><strong>Education:</strong> {avatar.education}</p>
                                <p className="profile-avatar-text"><strong>Interested Career:</strong> {avatar.career.join(', ')}</p>
                                <p className="profile-avatar-text"><strong>Marital Status:</strong> {avatar.maritalStatus}</p>
                                <p className="profile-avatar-text"><strong>Children:</strong> {avatar.children.map(child => child.name).join(', ')}</p>
                                <p className="profile-avatar-text"><strong>Pets:</strong> {avatar.pets.map(pet => pet.name).join(', ')}</p>
                                <p className="profile-avatar-text"><strong>Personality:</strong> {avatar.personality.join(', ')}</p>
                                <p className="profile-avatar-text"><strong>Special Notes:</strong> {avatar.specialNotes}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No avatars created yet.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;