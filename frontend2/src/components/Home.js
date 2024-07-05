import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
    const [avatars, setAvatars] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [hoverContent, setHoverContent] = useState(null);

    useEffect(() => {
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
        fetchAvatars();
    }, []);

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

    const handleShowModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    const handleHoverContent = (content) => {
        setHoverContent(content);
    };

    const handleLeaveHover = () => {
        setHoverContent(null);
    };

    return (
        <div className="container">
            <h2 className="my-4">Avatars</h2>
            <ul className="list-group">
                {Array.isArray(avatars) && avatars.length > 0 ? (
                    avatars.map((avatar) => (
                        <li key={avatar._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <img src={avatar.picture} alt={avatar.name} width="100" className="me-3" />
                                <h5 className="fw-bold">{avatar.name}</h5>
                                <p><strong>Age:</strong> {avatar.age}</p>
                                <p><strong>Hobbies:</strong> {avatar.hobbies}</p>
                                <p><strong>Education:</strong> {avatar.education}</p>
                                <p><strong>Marital Status:</strong> {avatar.maritalStatus}</p>
                                <p><strong>Children:</strong> {avatar.children}</p>
                                <p><strong>Pets:</strong> {avatar.pets}</p>
                                <p><strong>Personality:</strong> {avatar.personality}</p>
                                <p><strong>Special Notes:</strong> {avatar.specialNotes}</p>
                                <button onClick={() => handleShowModal([...avatar.jobs, { title: 'Career', company: avatar.career }])}>Jobs and Occupations</button>
                                <button onClick={() => handleShowModal(avatar.dailyRoutine)}>Daily Routine</button>
                                <div onMouseEnter={() => handleHoverContent(avatar.progressionLog)} onMouseLeave={handleLeaveHover}>
                                    <span>Progression Log</span>
                                </div>
                                <div onMouseEnter={() => handleHoverContent(avatar.goals)} onMouseLeave={handleLeaveHover}>
                                    <span>Goals</span>
                                </div>
                                <button onClick={() => handleShowModal(avatar.relationships)}>Relationships</button>
                            </div>
                            <div>
                                <button className="btn btn-danger me-2" onClick={() => deleteAvatar(avatar._id)}>Delete</button>
                                <button className="btn btn-primary" onClick={() => window.location.href = `/edit-avatar/${avatar._id}`}>Edit</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No avatars found.</li>
                )}
            </ul>

            {showModal && (
                <div className="modal" style={modalStyle}>
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        {Array.isArray(modalContent) && modalContent.length > 0 ? (
                            modalContent.map((item, index) => (
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

export default Home;