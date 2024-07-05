// ProgressionLog.js
import React from 'react';

function ProgressionLog({ logs }) {
    return (
        <div>
            <h3>Progression Log</h3>
            {logs.map((log, index) => (
                <div key={index}>
                    <p>Date: {new Date(log.date).toLocaleDateString()}</p>
                    <p>Statement: {log.statement}</p>
                </div>
            ))}
        </div>
    );
}

export default ProgressionLog;