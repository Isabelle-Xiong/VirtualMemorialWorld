import React, { useEffect, useRef } from 'react';
import useVirtualTime from '../hooks/useVirtualTime';
import axios from 'axios';

const VirtualClock = ({ speedMultiplier, onTick }) => {
    const { virtualSeconds } = useVirtualTime(speedMultiplier);
    const lastTimeRef = useRef(virtualSeconds);
    

    useEffect(() => {
        if (lastTimeRef.current !== virtualSeconds) {
            onTick(virtualSeconds); // Pass the adjusted time
            lastTimeRef.current = virtualSeconds;
        }
    }, [virtualSeconds, onTick]);

    useEffect(() => {
        const updateGoalStatus = async (avatarId) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            try {
                const response = await axios.post('http://localhost:5001/api/update-goal-status', { avatarId }, {
                    headers: { 'x-auth-token': token }
                });
                console.log(`Goal status updated for avatar ${avatarId}:`, response.data);
            } catch (error) {
                console.error(`Error updating goal status for avatar ${avatarId}:`, error);
            }
        };

        const generateNewGoal = async (avatarId) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            try {
                const response = await axios.post('http://localhost:5001/api/generate-new-goal', { avatarId }, {
                    headers: { 'x-auth-token': token }
                });
                console.log(`New goal generated for avatar ${avatarId}:`, response.data);
            } catch (error) {
                console.error(`Error generating new goal for avatar ${avatarId}:`, error);
            }
        };

        const generateNewRoutine = async (avatarId) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found, please log in.');
                return;
            }

            try {
                const response = await axios.post('http://localhost:5001/api/generate-new-routine', { avatarId }, {
                    headers: { 'x-auth-token': token }
                });
                console.log(`New routine generated for avatar ${avatarId}:`, response.data);
            } catch (error) {
                console.error(`Error generating new routine for avatar ${avatarId}:`, error);
            }
        };

        const randomInterval = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const initializeIntervals = (avatarId) => {
            const statusUpdateInterval = randomInterval(2, 5) * 1800 * (1000 / speedMultiplier); // Convert days to milliseconds
            const newGoalInterval = randomInterval(5, 7) * 1800 * (1000 / speedMultiplier); // Convert days to milliseconds
            const newRoutineInterval = 1800 * (1000 / speedMultiplier); // 1 day in milliseconds

            const statusUpdateTimer = setInterval(() => updateGoalStatus(avatarId), statusUpdateInterval);
            const newGoalTimer = setInterval(() => generateNewGoal(avatarId), newGoalInterval);
            const newRoutineTimer = setInterval(() => generateNewRoutine(avatarId), newRoutineInterval);

            return { statusUpdateTimer, newGoalTimer, newRoutineTimer };
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
                    const { statusUpdateTimer, newGoalTimer, newRoutineTimer} = initializeIntervals(avatar._id);
                    intervals.push({ avatarId: avatar._id, statusUpdateTimer, newGoalTimer, newRoutineTimer });
                });
            } catch (error) {
                console.error('Error fetching avatars:', error);
            }
        };

        fetchAvatars();

        return () => {
            intervals.forEach(({ statusUpdateTimer, newGoalTimer , newRoutineTimer}) => {
                clearInterval(statusUpdateTimer);
                clearInterval(newGoalTimer);
                clearInterval(newRoutineTimer)
            });
        };
    }, [speedMultiplier]);

    return null; // No return statement to avoid displaying the clock
};

export default VirtualClock;

