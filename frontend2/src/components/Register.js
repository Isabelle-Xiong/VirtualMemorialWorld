// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Auth.css';  // Ensure this line imports the new CSS file

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/register', {
                username,
                email,
                password
            });
            toast.success('Registration successful');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error registering:', error);
            toast.error('Error registering');
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
                <button type="submit" className="auth-button">Register</button>
            </form>
        </div>
    );
}

export default Register;