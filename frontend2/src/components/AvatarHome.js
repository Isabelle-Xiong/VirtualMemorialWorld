import React from 'react';
import { useParams } from 'react-router-dom';

function AvatarHome() {
    const { id } = useParams();

    return (
        <div>
            <h1>Avatar Home Page</h1>
            <p>Avatar ID: {id}</p>
        </div>
    );
}

export default AvatarHome;