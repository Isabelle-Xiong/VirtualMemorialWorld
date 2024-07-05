// RequestResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <div>
            <h2>Request Password Reset</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Request Password Reset</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default RequestResetPassword;