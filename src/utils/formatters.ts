export function getFormattedDate(date: Date) {
    const day = date.toLocaleDateString('en-KE', { weekday: 'long' }).toUpperCase();
    const thisDate = date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
    return `${day}, ${thisDate}`;
}
export function getFormattedWeekRange(date = new Date()) {
  const currentDay = date.getDay();
  // Adjust for Sunday (0) being the start of the week in JS getDay()
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

  // Calculate Monday
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  // Calculate Friday
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  // Format month and day
  const mondayMonth = monday.toLocaleDateString('en-KE', { month: 'short' });
  const mondayDay = monday.getDate();
  
  const fridayMonth = friday.toLocaleDateString('en-KE', { month: 'short' });
  const fridayDay = friday.getDate();

  // If both days are in the same month: "Aug 17 – 21"
  if (mondayMonth === fridayMonth) {
    return `${mondayMonth} ${mondayDay} – ${fridayDay}`;
  }

  // If the week spans across two months: "Aug 31 – Sep 4"
  return `${mondayMonth} ${mondayDay} – ${fridayMonth} ${fridayDay}`;
}
export function getFormattedTime(date: Date) {
    return date.toLocaleTimeString('en-KE', { hour: 'numeric', minute: '2-digit' });
}
export function getFormattedDuration(duration: number) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
}