import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditAvatar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [picture, setPicture] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [birthday, setBirthday] = useState('');
    const [education, setEducation] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');

    useEffect(() => {
        const fetchAvatar = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5001/api/avatars/${id}`, {
                    headers: { 'x-auth-token': token },
                });
                const { name, picture, hobbies, maritalStatus, birthday, education, specialNotes } = response.data;
                setName(name);
                setPicture(picture);
                setHobbies(hobbies);
                setMaritalStatus(maritalStatus);
                setBirthday(birthday);
                setEducation(education);
                setSpecialNotes(specialNotes);
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
            await axios.put(`http://localhost:5001/api/avatars/${id}`, { name, picture, hobbies, maritalStatus, birthday, education, specialNotes }, {
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
                <div className="mb-3">
                    <select
                        className="form-control"
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                    >
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label>Birthday:</label>
                    <input
                        type="date"
                        className="form-control"
                        placeholder="Birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <select
                        className="form-control"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                    >
                        <option value="">Select Education Level</option>
                        <option value="High School">High School</option>
                        <option value="Associate Degree">Associate Degree</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate">Doctorate</option>
                    </select>
                </div>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Special Notes"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
}

export default EditAvatar;