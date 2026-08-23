import { formatTime } from "./formatters";

export function calculateExpectedStartTime({firstLessonStartTime,lessonDuration,numSlot}: {firstLessonStartTime: string, lessonDuration: number,numSlot: number}){
    let calculatedStartTime="";
    if (firstLessonStartTime && lessonDuration) {
            const timeParts = firstLessonStartTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
            if (timeParts) {
              let [_, hrsStr, minsStr, modifier] = timeParts;
              let hrs = parseInt(hrsStr, 10);
              const mins = parseInt(minsStr, 10);
              
              if (modifier) {
                 modifier = modifier.toUpperCase();
                 if (modifier === 'PM' && hrs !== 12) hrs += 12;
                 if (modifier === 'AM' && hrs === 12) hrs = 0;
              }
              
              let currentMins = hrs * 60 + mins;
              
              // If duration is suspiciously small (e.g., 2), assume it is in hours and convert to minutes
              const durationInMins = lessonDuration < 10 ? lessonDuration * 60 : lessonDuration;
              
              for (let i = 1; i < numSlot; i++) {
                 currentMins += durationInMins;
                 if (currentMins === 780) { // 13:00 (1 PM)
                    currentMins += 60; // add 1 hour lunch break
                 }
              } 
              
              calculatedStartTime = formatTime(currentMins);
            }
    }
    return calculatedStartTime;
}