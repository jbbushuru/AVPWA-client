import { useState, useEffect } from "react";
import { getCurrentTime } from "../utils/getOngoingStatus";

export const useActiveLessonTimer = () => {
    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(getCurrentTime()), 60000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setCurrentTime(getCurrentTime());
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return currentTime;
};
