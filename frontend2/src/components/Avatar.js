import React, { useState } from 'react';
import axios from 'axios';

function Avatar() {
    const [name, setName] = useState('');
    const [picture, setPicture] = useState('');
    const [age, setAge] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [education, setEducation] = useState('');
    const [career, setCareer] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [children, setChildren] = useState('');
    const [pets, setPets] = useState('');
    const [personality, setPersonality] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://localhost:5001/api/avatars',
                { name, picture, age, hobbies, education, career, maritalStatus, children, pets, personality, specialNotes },
                { headers: { 'x-auth-token': token } }
            );
            console.log('Avatar created:', response.data);
        } catch (error) {
            console.error('Error creating avatar:', error);
        }
    };

    return (
        <div className="container">
            <h2 className="my-4">Create Avatar</h2>
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
                        type="number"
                        className="form-control"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
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
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Education"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Career"
                        value={career}
                        onChange={(e) => setCareer(e.target.value)}
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
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Children"
                        value={children}
                        onChange={(e) => setChildren(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Pets"
                        value={pets}
                        onChange={(e) => setPets(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Personality"
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Special Notes"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Avatar</button>
            </form>
        </div>
    );
}

export default Avatar;