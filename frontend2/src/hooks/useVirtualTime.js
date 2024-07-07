import { useState, useEffect } from 'react';

const useVirtualTime = (speedMultiplier) => {
    const [virtualSeconds, setVirtualSeconds] = useState(() => {
        const savedTime = localStorage.getItem('virtualSeconds');
        return savedTime ? parseInt(savedTime, 10) : 0;
    });
    const [virtualDay, setVirtualDay] = useState(() => {
        const savedDay = localStorage.getItem('virtualDay');
        return savedDay ? parseInt(savedDay, 10) : 1;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setVirtualSeconds((prevTime) => {
                const newTime = prevTime + 1;
                localStorage.setItem('virtualSeconds', newTime);
                return newTime;
            });
        }, 1000 / speedMultiplier);

        return () => clearInterval(interval);
    }, [speedMultiplier]);

    useEffect(() => {
        if (virtualSeconds >= 1799) {
            setVirtualDay((prevDay) => {
                const newDay = prevDay + 1;
                localStorage.setItem('virtualDay', newDay);
                return newDay;
            });
            setVirtualSeconds(0);
        } else {
            localStorage.setItem('virtualSeconds', virtualSeconds);
        }
    }, [virtualSeconds]);

    return { virtualSeconds, virtualDay, setVirtualDay };
};

export default useVirtualTime;