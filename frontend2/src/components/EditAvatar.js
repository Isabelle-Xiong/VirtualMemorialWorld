import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditAvatar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [picture, setPicture] = useState('');
    const [hobbies, setHobbies] = useState('');

    useEffect(() => {
        const fetchAvatar = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5001/api/avatars/${id}`, {
                    headers: { 'x-auth-token': token },
                });
                const { name, picture, hobbies } = response.data;
                setName(name);
                setPicture(picture);
                setHobbies(hobbies);
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        };
        fetchAvatar();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5001/api/avatars/${id}`, { name, picture, hobbies }, {
                headers: { 'x-auth-token': token },
            });
            navigate('/');
        } catch (error) {
            console.error('Error updating avatar:', error);
        }
    };

    return (
        <div className="container">
            <h2 className="my-4">Edit Avatar</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Picture URL"
                        value={picture}
                        onChange={(e) => setPicture(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Hobbies"
                        value={hobbies}
                        onChange={(e) => setHobbies(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
}

export default EditAvatar;