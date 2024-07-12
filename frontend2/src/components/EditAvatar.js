import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const personalityOptions = [
    'Adventurous', 'Artistic', 'Charismatic', 'Cheerful', 'Confident', 'Creative', 'Dependable',
    'Energetic', 'Friendly', 'Funny', 'Generous', 'Hardworking', 'Honest', 'Imaginative',
    'Independent', 'Kind', 'Loyal', 'Optimistic', 'Outgoing', 'Patient', 'Reliable', 'Sociable',
    'Thoughtful', 'Trustworthy'
];

const hobbyOptions = [
    'Reading', 'Traveling', 'Cooking', 'Gardening', 'Hiking', 'Fishing', 'Painting', 'Drawing',
    'Photography', 'Writing', 'Dancing', 'Playing Musical Instruments', 'Singing', 'Knitting',
    'Crafting', 'Collecting', 'Gaming', 'Yoga', 'Meditation', 'Fitness', 'Cycling', 'Running',
    'Swimming', 'Other'
];

function EditAvatar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [picture, setPicture] = useState('');
    const [hobbies, setHobbies] = useState([]);
    const [maritalStatus, setMaritalStatus] = useState('');
    const [birthday, setBirthday] = useState('');
    const [education, setEducation] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');
    const [customHobby, setCustomHobby] = useState('');
    const [personality, setPersonality] = useState([]);
    const [personalityTrait, setPersonalityTrait] = useState('');

    useEffect(() => {
        const fetchAvatar = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5001/api/avatars/${id}`, {
                    headers: { 'x-auth-token': token },
                });
                console.log('Fetched avatar data:', response.data); // Debug log
                const { name, picture, hobbies, maritalStatus, birthday, education, specialNotes, personality } = response.data;
                setName(name || '');
                setPicture(picture || '');
                setHobbies(hobbies || []);
                setMaritalStatus(maritalStatus || '');
                setBirthday(birthday ? birthday.split('T')[0] : '');
                setEducation(education || '');
                setSpecialNotes(specialNotes || '');
                setPersonality(personality || []);
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        };
        fetchAvatar();
    }, [id]);

    const handleAddHobby = () => {
        if (customHobby) {
            setHobbies([...hobbies, customHobby]);
            setCustomHobby('');
        }
    };

    const handleRemoveHobby = (index) => {
        setHobbies(hobbies.filter((_, i) => i !== index));
    };

    const handleAddPersonality = () => {
        if (personalityTrait && !personality.includes(personalityTrait)) {
            setPersonality([...personality, personalityTrait]);
            setPersonalityTrait('');
        }
    };

    const handleRemovePersonality = (index) => {
        setPersonality(personality.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `http://localhost:5001/api/avatars/${id}`,
                { name, picture, hobbies, maritalStatus, birthday, education, specialNotes, personality },
                { headers: { 'x-auth-token': token } }
            );
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
                    <label>Birthday:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label style={{ display: 'block', textAlign: 'center' }}>Hobbies</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <select
                            className="form-control"
                            style={{ width: '70%' }}
                            value={customHobby}
                            onChange={(e) => setCustomHobby(e.target.value)}
                        >
                            <option value="">Select Hobby</option>
                            {hobbyOptions.map((hobby, index) => (
                                <option key={index} value={hobby}>{hobby}</option>
                            ))}
                        </select>
                        <button type="button" className="btn btn-primary" style={{ width: '25%' }} onClick={handleAddHobby}>Add Hobby</button>
                    </div>
                    <ul className="list-centered">
                        {hobbies.map((hobby, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {hobby}
                                <button type="button" className="btn btn-link btn-sm" onClick={() => handleRemoveHobby(index)}>x</button>
                            </li>
                        ))}
                    </ul>
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
                    <label style={{ display: 'block', textAlign: 'center' }}>Personality Traits</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <select
                            className="form-control"
                            style={{ width: '70%' }}
                            value={personalityTrait}
                            onChange={(e) => setPersonalityTrait(e.target.value)}
                        >
                            <option value="">Select Personality Trait</option>
                            {personalityOptions.map((trait, index) => (
                                <option key={index} value={trait}>{trait}</option>
                            ))}
                        </select>
                        <button type="button" className="btn btn-primary" style={{ width: '25%' }} onClick={handleAddPersonality}>Add Trait</button>
                    </div>
                    <ul className="list-centered">
                        {personality.map((trait, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {trait}
                                <button type="button" className="btn btn-link btn-sm" onClick={() => handleRemovePersonality(index)}>x</button>
                            </li>
                        ))}
                    </ul>
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