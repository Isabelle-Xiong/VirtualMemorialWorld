// EmailVerificationRequest.js
import React, { useState } from 'react';
import axios from 'axios';

function EmailVerificationRequest() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/verify-email', { email });
            alert('Email verification link sent');
        } catch (error) {
            console.error('Error sending email verification link:', error);
        }
    };

    return (
        <div>
            <h2>Request Email Verification</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Send Verification Email</button>
            </form>
        </div>
    );
}

export default EmailVerificationRequest;