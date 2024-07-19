import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../Auth.css';

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5001/api/reset-password/${token}`, { password });
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('Error resetting password');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="auth-title">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="auth-label">New Password:</label>
                        <input
                            type="password"
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Reset Password</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default ResetPassword;