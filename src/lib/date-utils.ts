
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function getWeekDates(): Date[] {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate the date of Monday in the current week
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
  
  // Generate dates for the entire week
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
}

export function getColorByPercentage(percentage: number): string {
  if (percentage >= 80) return 'text-neon-lime';
  if (percentage >= 60) return 'text-green-500';
  if (percentage >= 40) return 'text-yellow-500';
  if (percentage >= 20) return 'text-orange-500';
  return 'text-red-500';
}
