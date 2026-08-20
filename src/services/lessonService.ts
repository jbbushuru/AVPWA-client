import { api } from "./api";

export interface Lesson {
    dateKey: string,
    slot: number,
    unitName: string,
    time: string,
    venue: string,
    lecturer: string,
    repeat: string,
    sourceDate: string,
}

export const getLessons = async (): Promise<Lesson[]> => {
    const {data} = await api.get('/lessons');
    return data;
}

export const createLesson = async(lessonData:Lesson)=>{
    const {data} = await api.post('/lessons',lessonData)
    return data;
}