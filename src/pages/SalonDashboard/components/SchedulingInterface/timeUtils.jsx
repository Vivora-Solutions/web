export const formatDateToString = (date) => {
  return date.toISOString().split('T')[0];
};

export const parseTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatDateTime = (date, totalMinutes) => {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${date}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00Z`;
};

 export const isDaySelected = (date) => {
    const dateStr = formatDateToString(date)
    return selectedLeaveDays.includes(dateStr)
  }