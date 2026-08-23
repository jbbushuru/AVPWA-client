import {api} from './api';

export interface TimetableSettings{
    maxLessons: number;
    lessonDuration: number;
    firstLessonStartTime: string;
    notificationsEnabled: boolean;
    alertLeadTime: number;
}

export const getTimetableSettings = async () => {
    const response = await api.get('/timetable/settings');
    return response.data;
}

export const setTimetableSettings = async (settings: TimetableSettings) => {
    const response = await api.post('/timetable/settings', settings);
    return response.data;
}

export const updateTimetableSettings = async (settings: TimetableSettings) => {
    const response = await api.patch('/timetable/settings', settings);
    return response.data;
}

export const deleteTimetableSettings = async () => {
    const response = await api.delete('/timetable/settings');
    return response.data;
}