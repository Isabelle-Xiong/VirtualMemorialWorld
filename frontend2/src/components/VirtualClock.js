import React, { useEffect, useState } from 'react';

const VirtualClock = ({ speedMultiplier, onTick }) => {
    const [virtualTime, setVirtualTime] = useState(() => {
        const savedTime = localStorage.getItem('virtualTime');
        return savedTime ? parseInt(savedTime, 10) : 0;
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

    // No return statement to avoid displaying the clock
};

export default VirtualClock;