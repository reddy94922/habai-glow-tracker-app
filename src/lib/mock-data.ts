
export const mockHabits = [
  {
    id: "1",
    name: "Morning Meditation",
    category: "Wellness",
    streak: 7,
    target: 10,
    completed: 7,
    completionRate: 70,
    color: "#CCFF99",
    icon: "meditation",
  },
  {
    id: "2",
    name: "Coding Practice",
    category: "Professional",
    streak: 15,
    target: 20,
    completed: 18,
    completionRate: 90,
    color: "#00469B",
    icon: "code",
  },
  {
    id: "3",
    name: "Evening Run",
    category: "Fitness",
    streak: 3,
    target: 15,
    completed: 12,
    completionRate: 80,
    color: "#6E56CF",
    icon: "run",
  },
  {
    id: "4",
    name: "Read a Book",
    category: "Personal",
    streak: 5,
    target: 30,
    completed: 20,
    completionRate: 67,
    color: "#EA5A0C",
    icon: "book",
  }
];

export const mockWeeklyData = [
  { day: "Mon", completion: 80 },
  { day: "Tue", completion: 65 },
  { day: "Wed", completion: 90 },
  { day: "Thu", completion: 75 },
  { day: "Fri", completion: 85 },
  { day: "Sat", completion: 50 },
  { day: "Sun", completion: 70 }
];

export const weeklyHeatmapData = [
  { day: "Monday", hours: [1, 0, 0, 2, 3, 2, 1, 0] },
  { day: "Tuesday", hours: [0, 1, 2, 2, 1, 0, 0, 1] },
  { day: "Wednesday", hours: [2, 3, 1, 0, 0, 1, 2, 0] },
  { day: "Thursday", hours: [0, 1, 1, 3, 2, 2, 1, 0] },
  { day: "Friday", hours: [1, 2, 3, 1, 0, 0, 2, 1] },
  { day: "Saturday", hours: [0, 0, 0, 1, 2, 3, 1, 0] },
  { day: "Sunday", hours: [0, 1, 0, 0, 1, 1, 2, 3] }
];

export const mockMessages = [
  {
    id: "1",
    user_id: "mock-user-id",
    text: "Great job on your meditation streak! You're on day 7! 🧘‍♂️",
    is_user: false,
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: "2",
    user_id: "mock-user-id",
    text: "I've noticed you've been completing your evening run earlier. This is good for better sleep! 🏃‍♂️",
    is_user: false,
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: "3",
    user_id: "mock-user-id",
    text: "You missed your reading goal yesterday. Would you like to reschedule it? 📚",
    is_user: false,
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

export const aiSuggestions = [
  "Try meditating 5 minutes earlier to avoid morning rush",
  "Your focus is highest between 10-11 AM. Schedule deep work then!",
  "Consider adding a short stretching routine after your evening run",
  "You've been consistent with coding! Ready for a slightly bigger challenge?",
  "Based on your patterns, a 15-minute walk after lunch could boost your afternoon productivity"
];
