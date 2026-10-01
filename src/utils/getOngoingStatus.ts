export const getCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export const isLessonOngoing = (lessonTime: string, durationMinutes: number, currentTime: string = getCurrentTime()): boolean => {
    if (!lessonTime) return false;
    
    let timeStr = lessonTime;
    const timeMatch = lessonTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3];
        if (ampm) {
            if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
            if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
        }
        timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const [lHours, lMinutes] = timeStr.split(':').map(Number);
    const [cHours, cMinutes] = currentTime.split(':').map(Number);

    if (isNaN(lHours) || isNaN(lMinutes) || isNaN(cHours) || isNaN(cMinutes)) return false;

    const durationInMins = durationMinutes < 10 ? durationMinutes * 60 : durationMinutes;
    const lessonStartInMinutes = lHours * 60 + lMinutes;
    const lessonEndInMinutes = lessonStartInMinutes + durationInMins;
    const currentInMinutes = cHours * 60 + cMinutes;

    return currentInMinutes >= lessonStartInMinutes && currentInMinutes < lessonEndInMinutes;
};
