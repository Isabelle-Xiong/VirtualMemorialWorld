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
        const updateGoalStatus = (avatarId) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            axios.post('http://localhost:5001/api/update-goal-status', { avatarId }, {
                headers: { 'x-auth-token': token }
            })
                .then(response => {
                    console.log(`Goal status updated for avatar ${avatarId}:`, response.data);
                })
                .catch(error => {
                    console.error(`Error updating goal status for avatar ${avatarId}:`, error);
                });
        };

        const generateNewGoal = (avatarId) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            axios.post('http://localhost:5001/api/generate-new-goal', { avatarId }, {
                headers: { 'x-auth-token': token }
            })
                .then(response => {
                    console.log(`New goal generated for avatar ${avatarId}:`, response.data);
                })
                .catch(error => {
                    console.error(`Error generating new goal for avatar ${avatarId}:`, error);
                });
        };

        const randomInterval = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const initializeIntervals = (avatarId) => {
            const statusUpdateInterval = randomInterval(2, 5) * 1800 * (1000 / speedMultiplier); // Convert days to milliseconds
            const newGoalInterval = randomInterval(5, 7) * 1800 * (1000 / speedMultiplier); // Convert days to milliseconds

            const statusUpdateTimer = setInterval(() => updateGoalStatus(avatarId), statusUpdateInterval);
            const newGoalTimer = setInterval(() => generateNewGoal(avatarId), newGoalInterval);

            return { statusUpdateTimer, newGoalTimer };
        };

        let intervals = [];

        const fetchAvatars = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5001/api/avatars', {
                    headers: { 'x-auth-token': token },
                });
                response.data.forEach(avatar => {
                    const { statusUpdateTimer, newGoalTimer } = initializeIntervals(avatar._id);
                    intervals.push({ avatarId: avatar._id, statusUpdateTimer, newGoalTimer });
                });
            } catch (error) {
                console.error('Error fetching avatars:', error);
            }
        };

        fetchAvatars();

        return () => {
            intervals.forEach(({ statusUpdateTimer, newGoalTimer }) => {
                clearInterval(statusUpdateTimer);
                clearInterval(newGoalTimer);
            });
        };
    }, [speedMultiplier, virtualTime, previousVirtualDay]);

    return null; // No return statement to avoid displaying the clock
};

export default VirtualClock;