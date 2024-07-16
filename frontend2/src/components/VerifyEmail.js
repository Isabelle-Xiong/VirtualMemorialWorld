// VerifyEmail.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
function VerifyEmail() {
    const { token } = useParams();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/verify-email/${token}`);
             
            } catch (error) {
                console.error('Error verifying email:', error);
             
            }
        };
        verifyEmail();
    }, [token]);

    return (
        <div>
            <h2>Verifying your email...</h2>
        </div>
    );
}

export default VerifyEmail;