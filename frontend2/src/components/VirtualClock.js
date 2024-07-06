import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VirtualClock = ({ speedMultiplier, onTick }) => {
    const [virtualTime, setVirtualTime] = useState(() => {
        const savedTime = localStorage.getItem('virtualTime');
        return savedTime ? parseInt(savedTime, 10) : 0;
    });
    const [previousVirtualDay, setPreviousVirtualDay] = useState(() => {
        const savedDay = localStorage.getItem('virtualDay');
        return savedDay ? parseInt(savedDay, 10) : 0;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setVirtualTime(prevTime => {
                const newTime = prevTime + 1;
                const adjustedTime = newTime % 1800; // Ensure it wraps correctly at 1800
                onTick(adjustedTime); // Pass the adjusted time
                localStorage.setItem('virtualTime', newTime);
                return newTime;
            });
        }, 1000 / speedMultiplier);

        return () => clearInterval(interval);
    }, [speedMultiplier, onTick]);

    useEffect(() => {
        const updateGoalStatus = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            console.log('Calling updateGoalStatus');
            axios.post('http://localhost:5001/api/update-goal-status', {}, {
                headers: { 'x-auth-token': token }
            })
                .then(response => {
                    console.log('Goal status updated:', response.data);
                })
                .catch(error => {
                    console.error('Error updating goal status:', error);
                });
        };

        const generateNewGoal = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            console.log('Calling generateNewGoal');
            axios.post('http://localhost:5001/api/generate-new-goal', {}, {
                headers: { 'x-auth-token': token }
            })
                .then(response => {
                    console.log('New goal generated:', response.data);
                })
                .catch(error => {
                    console.error('Error generating new goal:', error);
                });
        };

        const updateAndGenerateGoals = () => {
            updateGoalStatus();
            generateNewGoal();
        };

        const interval = setInterval(() => {
            const currentVirtualDay = Math.floor(virtualTime / 1800); // Calculate the current virtual day
            if (currentVirtualDay !== previousVirtualDay) {
                console.log(`Day changed from ${previousVirtualDay} to ${currentVirtualDay}`);
                setPreviousVirtualDay(currentVirtualDay);
                updateAndGenerateGoals();
            }
        }, 1000 / speedMultiplier);

        return () => clearInterval(interval);
    }, [speedMultiplier, virtualTime, previousVirtualDay]);

    return null; // No return statement to avoid displaying the clock
};

export default VirtualClock;