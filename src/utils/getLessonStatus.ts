import { Lesson as APILesson } from '../services/lessonService';

export type LessonStatus = 'completed' | 'ongoing' | 'upcoming' | 'cancelled';

export const getLessonStatus = (
  lesson: APILesson,
  date: Date,
  lessonDuration: number,
  currentTime: string
): LessonStatus => {
  if (lesson.unitName === '__HIDDEN__') {
    return 'cancelled';
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const targetDateStr = date.toISOString().split('T')[0];

  // 1. Past dates are automatically completed
  if (targetDateStr < todayStr) return 'completed';

  // 2. Future dates are automatically upcoming
  if (targetDateStr > todayStr) return 'upcoming';

  // 3. For Today: compare start and end times
  let timeStr = lesson.time || '00:00';
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
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

  if (isNaN(lHours) || isNaN(lMinutes) || isNaN(cHours) || isNaN(cMinutes)) {
    return 'upcoming';
  }

  const durationInMins = lessonDuration < 10 ? lessonDuration * 60 : lessonDuration;
  const startMins = lHours * 60 + lMinutes;
  const endMins = startMins + durationInMins;
  const currentMins = cHours * 60 + cMinutes;

  if (currentMins >= endMins) return 'completed';
  if (currentMins >= startMins && currentMins < endMins) return 'ongoing';

  return 'upcoming';
};