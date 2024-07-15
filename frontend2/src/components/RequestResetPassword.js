import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Auth.css'; // Ensure you import the CSS file

function RequestResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/request-reset-password', { email });
            toast.success(response.data.message);
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error requesting password reset:', error);
            toast.error('Error requesting password reset');
            setMessage('Error requesting password reset');
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Request Password Reset</h2>
            <div className="auth-form-container">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="auth-label">Email:</label>
                        <input
                            type="email"
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Request Password Reset</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default RequestResetPassword;