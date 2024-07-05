// DailyRoutine.js
import React from 'react';

function DailyRoutine({ routine }) {
    return (
        <div>
            <h3>Daily Routine</h3>
            {routine.map((item, index) => (
                <div key={index}>
                    <p>Time: {item.time}</p>
                    <p>Event: {item.event}</p>
                </div>
            ))}
        </div>
    );
}

export default DailyRoutine;