// Jobs.js
import React from 'react';

function Jobs({ jobs }) {
    return (
        <div>
            <h3>Jobs and Occupations</h3>
            {jobs.map((job, index) => (
                <div key={index}>
                    <p>Title: {job.title}</p>
                    <p>Company: {job.company}</p>
                    <p>Start Date: {new Date(job.startDate).toLocaleDateString()}</p>
                    <p>End Date: {job.isCurrent ? 'Current' : new Date(job.endDate).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}

export default Jobs;