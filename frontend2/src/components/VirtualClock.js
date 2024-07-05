// src/components/VirtualClock.js
import React, { useEffect, useState } from 'react';

const VirtualClock = ({ speedMultiplier, onTick }) => {
    const [virtualTime, setVirtualTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setVirtualTime(prevTime => prevTime + 1);
            onTick(virtualTime);
        }, 1000 / speedMultiplier);

        return () => clearInterval(interval);
    }, [virtualTime, speedMultiplier, onTick]);

    return (
        <div>
            <h2>Virtual Time: {virtualTime}</h2>
        </div>
    );
};

export default VirtualClock;