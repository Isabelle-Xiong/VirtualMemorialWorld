// Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Auth.css';  // Ensure this line imports the new CSS file

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/login', { username, password });
            localStorage.setItem('token', response.data.token);
            toast.success('Login successful');
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Error logging in');
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Login</h2>
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
                    <label className="auth-label">Password:</label>
                    <input
                        type="password"
                        className="auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="auth-button">Login</button>
            </form>
            <p className="auth-footer">
                Forgot your password? <Link to="/request-reset-password">Reset it here</Link>
            </p>
        </div>
    );
}

export default Login;