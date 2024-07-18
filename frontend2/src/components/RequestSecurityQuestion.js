import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const predefinedQuestions = [
    "What is your favorite color?",
    "What is your favorite vegetable?",
    "What is your favorite animal?"
];

const securityAnswers = [
    ["Red", "Blue", "Green", "Yellow", "Black", "White"],
    ["Carrot", "Broccoli", "Spinach", "Pepper", "Tomato", "Potato"],
    ["Dog", "Cat", "Bird", "Fish", "Horse", "Elephant"]
];

function RequestSecurityQuestion() {
    const [username, setUsername] = useState('');
    const [answers, setAnswers] = useState(securityAnswers.map(arr => arr[0]));
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Submitting:', { username, answers });
        try {
            const response = await axios.post('http://localhost:5001/api/request-security-question', {
                username,
                answers,
            });
            console.log('Response:', response.data);
            if (response.data.token) {
                navigate(`/reset-password/${response.data.token}`);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error verifying security questions:', error);
            setMessage('Error verifying security questions');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="auth-title">Answer Security Questions</h2>
                <form className="auth-form-container" onSubmit={handleSubmit}>
                    <div>
                        <label className="auth-label">Username:</label>
                        <input
                            type="text"
                            className="auth-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    {predefinedQuestions.map((question, index) => (
                        <div key={index}>
                            <label className="auth-label">{question}</label>
                            <select
                                className="auth-input"
                                value={answers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                required
                            >
                                {securityAnswers[index].map((answer, answerIndex) => (
                                    <option key={answerIndex} value={answer}>{answer}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                    <button type="submit" className="auth-button">Submit</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default RequestSecurityQuestion;