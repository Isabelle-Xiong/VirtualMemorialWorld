// Relationships.js
import React from 'react';

function Relationships({ relationships }) {
    return (
        <div>
            <h3>Relationships</h3>
            {relationships.map((relationship, index) => (
                <div key={index}>
                    <p>Type: {relationship.type}</p>
                    <p>Name: {relationship.name}</p>
                    <p>Since: {new Date(relationship.since).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}

export default Relationships;