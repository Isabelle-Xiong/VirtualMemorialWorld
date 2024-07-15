import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Avatar.css'; // Adjusted import path
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



function Avatar({ virtualTime }) { // Receive virtualTime as a prop
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [picture, setPicture] = useState('');
    const [age, setAge] = useState('');
    const [birthday, setBirthday] = useState('');
    const [hobbies, setHobbies] = useState([]);
    const [customHobby, setCustomHobby] = useState('');
    const [education, setEducation] = useState('');
    const [career, setCareer] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [children, setChildren] = useState([]);
    const [pets, setPets] = useState([]);
    const [personality, setPersonality] = useState([]);
    const [personalityTrait, setPersonalityTrait] = useState('');
    const [goals, setGoals] = useState([{ goal: '', status: '' }]);
    const [specialNotes, setSpecialNotes] = useState('');
    const [childGender, setChildGender] = useState('');
    const [childName, setChildName] = useState('');
    const [petType, setPetType] = useState('');
    const [petName, setPetName] = useState('');
    const [avatarId, setAvatarId] = useState(null);
    const [avatarProps, setAvatarProps] = useState({
        topType: "ShortHairShortFlat",
        accessoriesType: "Blank",
        hairColor: "BrownDark",
        facialHairType: "Blank",
        clotheType: "BlazerSweater",
        eyeType: "Default",
        eyebrowType: "Default",
        mouthType: "Smile",
        skinColor: "Light"
    });

    useEffect(() => {
        const fetchAvatarData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5001/api/avatars/${id}`, {
                    headers: { 'x-auth-token': token },
                });
                const avatarData = response.data;
                setAvatarId(avatarData._id);
                setAvatarProps({
                    topType: avatarData.topType || "ShortHairShortFlat",
                    accessoriesType: avatarData.accessoriesType || "Blank",
                    hairColor: avatarData.hairColor || "BrownDark",
                    facialHairType: avatarData.facialHairType || "Blank",
                    clotheType: avatarData.clotheType || "BlazerSweater",
                    eyeType: avatarData.eyeType || "Default",
                    eyebrowType: avatarData.eyebrowType || "Default",
                    mouthType: avatarData.mouthType || "Smile",
                    skinColor: avatarData.skinColor || "Light"
                });
            } catch (error) {
                console.error('Error fetching avatar data:', error);
            }
        };

        if (id) {
            fetchAvatarData();
        }
    }, [id]);

    // Job-related state variables
    const [jobs, setJobs] = useState([]);
    const [jobTitle, setJobTitle] = useState('');
    const [jobCompany, setJobCompany] = useState('');
    const [jobStartDate, setJobStartDate] = useState('');
    const [jobEndDate, setJobEndDate] = useState('');
    const [jobIsCurrent, setJobIsCurrent] = useState(false);

    // Routine-related state variables
    const [dailyRoutine, setDailyRoutine] = useState([
        { time: "08:00", event: "Wake up" },
        { time: "09:00", event: "Go to work" }
    ]);
    const [relationships, setRelationships] = useState([]);

    useEffect(() => {
        const updateRoutine = () => {
            console.log(`Updating ${name}'s routine at virtual time ${virtualTime}`);
            // Implement routine update logic based on virtual time
        };

        const updateRelationships = () => {
            console.log(`Updating ${name}'s relationships at virtual time ${virtualTime}`);
            // Implement relationship update logic based on virtual time
        };

        updateRoutine();
        updateRelationships();
    }, [virtualTime]);

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

    const handleAddJob = () => {
        setJobs([...jobs, { title: jobTitle, company: jobCompany, startDate: jobStartDate, endDate: jobIsCurrent ? null : jobEndDate, isCurrent: jobIsCurrent }]);
        setJobTitle('');
        setJobCompany('');
        setJobStartDate('');
        setJobEndDate('');
        setJobIsCurrent(false);
    };

    const handleRemoveJob = (index) => {
        setJobs(jobs.filter((_, i) => i !== index));
    };

    const handleJobIsCurrentChange = (checked) => {
        setJobIsCurrent(checked);
        if (checked) {
            setJobEndDate('');
        }
    };

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

    const handleAddGoal = () => {
        setGoals([...goals, { goal: '', status: '' }]);
    };

    const handleRemoveGoal = (index) => {
        setGoals(goals.filter((_, i) => i !== index));
    };

    const handleGoalChange = (index, field, value) => {
        const newGoals = goals.slice();
        newGoals[index][field] = value;
        setGoals(newGoals);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://localhost:5001/api/avatars',
                { name, picture, age, birthday, hobbies, education, career, maritalStatus, children, pets, personality, specialNotes, jobs, goals },
                { headers: { 'x-auth-token': token } }
            );
            setAvatarId(response.data._id); // Set the avatarId from the response
            navigate('/');
            console.log('Avatar created:', response.data);
        } catch (error) {
            console.error('Error creating avatar:', error);
        }
    };

    return (
        <div className="container">
            <h2 className="my-4">Create Avatar</h2>
            <form onSubmit={handleSubmit} className="form-center">
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
                    <label style={{ display: 'block', textAlign: 'center' }}>Hobbies</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <select
                            className="form-control"
                            style={{ width: '70%' }}
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
                        <button type="button" className="btn btn-secondary" style={{ width: '15%' }} onClick={handleAddChild}>Add Child</button>
                    </div>
                    <ul className="list-centered">
                        {children.map((child, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {child.gender} - {child.name}
                                <button type="button" className="btn btn-link btn-sm" onClick={() => handleRemoveChild(index)}>x</button>
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
                        <button type="button" className="btn btn-secondary" style={{ width: '15%' }} onClick={handleAddPet}>Add Pet</button>
                    </div>
                    <ul className="list-centered">
                        {pets.map((pet, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {pet.type} - {pet.name}
                                <button type="button" className="btn btn-link btn-sm" onClick={() => handleRemovePet(index)}>x</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mb-3">
                    <label style={{ display: 'block', textAlign: 'center' }}>Jobs</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Job Title"
                            style={{ width: '20%' }}
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Company"
                            style={{ width: '20%' }}
                            value={jobCompany}
                            onChange={(e) => setJobCompany(e.target.value)}
                        />
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Start Date"
                            style={{ width: '20%' }}
                            value={jobStartDate}
                            onChange={(e) => setJobStartDate(e.target.value)}
                        />
                        <input
                            type="date"
                            className="form-control"
                            placeholder="End Date"
                            style={{ width: '20%' }}
                            value={jobEndDate}
                            onChange={(e) => setJobEndDate(e.target.value)}
                            disabled={jobIsCurrent}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={jobIsCurrent}
                                onChange={(e) => handleJobIsCurrentChange(e.target.checked)}
                            /> Current
                        </label>
                        <button type="button" className="btn btn-secondary" style={{ width: '15%' }} onClick={handleAddJob}>Add Job</button>
                    </div>
                    <ul className="list-centered">
                        {jobs.map((job, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {job.title} at {job.company} from {job.startDate} to {job.endDate ? job.endDate : 'Present'} {job.isCurrent ? '(Current)' : ''}
                                <button type="button" className="btn btn-link btn-sm" onClick={() => handleRemoveJob(index)}>x</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mb-3">
                    <label style={{ display: 'block', textAlign: 'center' }}>Goals</label>
                    {goals.map((goal, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Goal"
                                value={goal.goal}
                                onChange={(e) => handleGoalChange(index, 'goal', e.target.value)}
                                style={{ width: '40%' }}
                            />
                            <select
                                className="form-control"
                                value={goal.status}
                                onChange={(e) => handleGoalChange(index, 'status', e.target.value)}
                                style={{ width: '40%' }}
                            >
                                <option value="">Select Status</option>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <button type="button" className="btn btn-link btn-sm" onClick={() => handleRemoveGoal(index)}>x</button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={handleAddGoal}>Add Goal</button>
                </div>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Special Notes"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/customize-avatar')}
                >
                    Customize Avatar
                </button>
                
                <button type="submit" className="btn btn-create">Create Avatar</button>
            </form>
        </div>
    );
}

export default Avatar;