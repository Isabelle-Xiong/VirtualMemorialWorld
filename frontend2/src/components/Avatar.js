import React, { useState } from 'react';
import axios from 'axios';

function Avatar() {
    const [name, setName] = useState('');
    const [picture, setPicture] = useState('');
    const [age, setAge] = useState('');
    const [birthday, setBirthday] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [education, setEducation] = useState('');
    const [career, setCareer] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [children, setChildren] = useState([]);
    const [pets, setPets] = useState([]);
    const [personality, setPersonality] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');

    const [childGender, setChildGender] = useState('');
    const [childName, setChildName] = useState('');
    const [petType, setPetType] = useState('');
    const [petName, setPetName] = useState('');

    const handleAddChild = () => {
        setChildren([...children, { gender: childGender, name: childName }]);
        setChildGender('');
        setChildName('');
    };

    const handleRemoveChild = (index) => {
        setChildren(children.filter((_, i) => i !== index));
    };

    const handleAddPet = () => {
        setPets([...pets, { type: petType, name: petName }]);
        setPetType('');
        setPetName('');
    };

    const handleRemovePet = (index) => {
        setPets(pets.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://localhost:5001/api/avatars',
                { name, picture, age, birthday, hobbies, education, career, maritalStatus, children, pets, personality, specialNotes },
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
                    <select
                        className="form-control"
                        value={career}
                        onChange={(e) => setCareer(e.target.value)}
                    >
                        <option value="">Select Career</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Engineer">Engineer</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Artist">Artist</option>
                    </select>
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
                    <label style={{ display: 'block', textAlign: 'center' }}>Children</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <select
                            className="form-control"
                            style={{ width: '30%' }}
                            value={childGender}
                            onChange={(e) => setChildGender(e.target.value)}
                        >
                            <option value="">Select Child Gender</option>
                            <option value="Boy">Boy</option>
                            <option value="Girl">Girl</option>
                            <option value="Non-binary">Non-binary</option>
                        </select>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Child Name"
                            style={{ width: '50%' }}
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                        />
                        <button type="button" className="btn btn-primary" style={{ width: '15%' }} onClick={handleAddChild}>Add Child</button>
                    </div>
                    <ul>
                        {children.map((child, index) => (
                            <li key={index}>
                                {child.gender} - {child.name}
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveChild(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mb-3">
                    <label style={{ display: 'block', textAlign: 'center' }}>Pets</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <select
                            className="form-control"
                            style={{ width: '30%' }}
                            value={petType}
                            onChange={(e) => setPetType(e.target.value)}
                        >
                            <option value="">Select Pet Type</option>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Fish">Fish</option>
                        </select>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pet Name"
                            style={{ width: '50%' }}
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                        />
                        <button type="button" className="btn btn-primary" style={{ width: '15%' }} onClick={handleAddPet}>Add Pet</button>
                    </div>
                    <ul>
                        {pets.map((pet, index) => (
                            <li key={index}>
                                {pet.type} - {pet.name}
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemovePet(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
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