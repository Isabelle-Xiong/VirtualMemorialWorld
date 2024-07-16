import React, { useState } from 'react';
import axios from 'axios';
import '../Auth.css';

const securityQuestions = [
    "What is your favorite color?",
    "What is your favorite vegetable?",
    "What is your favorite animal?"
];

const securityAnswers = [
    ["Red", "Blue", "Green", "Yellow", "Black", "White"],
    ["Carrot", "Broccoli", "Spinach", "Pepper", "Tomato", "Potato"],
    ["Dog", "Cat", "Bird", "Fish", "Horse", "Elephant"]
];

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [answers, setAnswers] = useState(securityAnswers.map(arr => arr[0]));
    const [message, setMessage] = useState('');

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/register', {
                username,
                email,
                password,
                securityQuestions: [
                    { question: securityQuestions[0], answer: answers[0] },
                    { question: securityQuestions[1], answer: answers[1] },
                    { question: securityQuestions[2], answer: answers[2] }
                ]
            });
            setMessage('Registration successful!');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error registering:', error);
            setMessage('Error registering. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Register</h2>
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
                <div>
                    <label className="auth-label">Email:</label>
                    <input
                        type="email"
                        className="auth-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="auth-label">Password:</label>
                    <input
                        type="password"
                        className="auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="security-questions-container">
                    <h3>Security Questions</h3>
                    {securityQuestions.map((question, index) => (
                        <div key={index} className="security-question">
                            <label className="security-label">{question}:</label>
                            <select
                                className="security-dropdown"
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
                </div>
                <button type="submit" className="auth-button">Register</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default Register;