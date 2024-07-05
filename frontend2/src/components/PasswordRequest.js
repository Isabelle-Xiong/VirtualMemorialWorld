// PasswordResetRequest.js
import React, { useState } from 'react';
import axios from 'axios';

function PasswordResetRequest() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/request-reset-password', { email });
            alert('Password reset email sent');
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    };

    return (
        <div>
            <h2>Request Password Reset</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Send Reset Email</button>
            </form>
        </div>
    );
}

export default PasswordResetRequest;