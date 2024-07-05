// VerifyEmail.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VerifyEmail() {
    const { token } = useParams();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/verify-email/${token}`);
                toast.success(response.data.message);
            } catch (error) {
                console.error('Error verifying email:', error);
                toast.error('Error verifying email');
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