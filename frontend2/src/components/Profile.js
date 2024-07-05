import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5001/api/profile', {
                    headers: { 'x-auth-token': token }
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2 className="my-4">Profile</h2>
            <div className="card">
                <img src={profile.picture} className="card-img-top" alt={profile.name} />
                <div className="card-body">
                    <h5 className="card-title">{profile.name}</h5>
                    <p className="card-text"><strong>Age:</strong> {profile.age}</p>
                    <p className="card-text"><strong>Hobbies:</strong> {profile.hobbies}</p>
                    <p className="card-text"><strong>Education:</strong> {profile.education}</p>
                    <p className="card-text"><strong>Interested Career:</strong> {profile.career}</p>
                    <p className="card-text"><strong>Marital Status:</strong> {profile.maritalStatus}</p>
                    <p className="card-text"><strong>Children:</strong> {profile.children}</p>
                    <p className="card-text"><strong>Pets:</strong> {profile.pets}</p>
                    <p className="card-text"><strong>Personality:</strong> {profile.personality}</p>
                    <p className="card-text"><strong>Special Notes:</strong> {profile.specialNotes}</p>

                    <h4>Jobs and Occupations</h4>
                    {profile.jobs?.map((job, index) => (
                        <div key={index}>
                            <p><strong>Title:</strong> {job.title}</p>
                            <p><strong>Company:</strong> {job.company}</p>
                            <p><strong>Start Date:</strong> {job.startDate}</p>
                            <p><strong>End Date:</strong> {job.endDate}</p>
                            <p><strong>Current Job:</strong> {job.isCurrent ? "Yes" : "No"}</p>
                        </div>
                    ))}

                    <h4>Pets</h4>
                    {profile.pets?.map((pet, index) => (
                        <div key={index}>
                            <p><strong>Name:</strong> {pet.name}</p>
                            <p><strong>Type:</strong> {pet.type}</p>
                            <p><strong>Age:</strong> {pet.age}</p>
                        </div>
                    ))}

                    <h4>Daily Routine</h4>
                    {profile.dailyRoutine?.map((item, index) => (
                        <div key={index}>
                            <p><strong>Time:</strong> {item.time}</p>
                            <p><strong>Event:</strong> {item.event}</p>
                        </div>
                    ))}

                    <h4>Progression Log</h4>
                    {profile.progressionLog?.map((log, index) => (
                        <div key={index}>
                            <p><strong>Date:</strong> {log.date}</p>
                            <p><strong>Statement:</strong> {log.statement}</p>
                        </div>
                    ))}

                    <h4>Relationships</h4>
                    {profile.relationships?.map((relationship, index) => (
                        <div key={index}>
                            <p><strong>Type:</strong> {relationship.type}</p>
                            <p><strong>Name:</strong> {relationship.name}</p>
                            <p><strong>Since:</strong> {relationship.since}</p>
                        </div>
                    ))}

                    <h4>Goals</h4>
                    {profile.goals?.map((goal, index) => (
                        <div key={index}>
                            <p><strong>Goal:</strong> {goal.goal}</p>
                            <p><strong>Status:</strong> {goal.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;