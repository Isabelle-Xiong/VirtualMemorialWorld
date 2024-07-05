// Goals.js
import React from 'react';

function Goals({ goals }) {
    return (
        <div>
            <h3>Goals</h3>
            {goals.map((goal, index) => (
                <div key={index}>
                    <p>Goal: {goal.goal}</p>
                    <p>Status: {goal.status}</p>
                </div>
            ))}
        </div>
    );
}

export default Goals;