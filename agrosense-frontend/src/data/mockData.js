export const latestStats = [
  { label: "Soil Moisture", value: "65%", sub: "↑ 4% vs last week" },
  { label: "Temperature", value: "28°C", sub: "↓ 1°C vs last week" },
  { label: "Humidity", value: "72%", sub: "↑ 6% vs last week" },
  { label: "Rainfall", value: "12mm", sub: "↑ 3mm vs last week" },
];

export const weeklySeries = [
  { day: "Mon", moisture: 58, temp: 29, humidity: 66, rainfall: 2 },
  { day: "Tue", moisture: 60, temp: 30, humidity: 64, rainfall: 0 },
  { day: "Wed", moisture: 63, temp: 29, humidity: 67, rainfall: 4 },
  { day: "Thu", moisture: 62, temp: 28, humidity: 70, rainfall: 1 },
  { day: "Fri", moisture: 64, temp: 28, humidity: 71, rainfall: 0 },
  { day: "Sat", moisture: 66, temp: 27, humidity: 73, rainfall: 3 },
  { day: "Sun", moisture: 65, temp: 28, humidity: 72, rainfall: 2 },
];

export const forecast = [
  { day: "Today", condition: "Partly Cloudy", temp: "28° / 22°" },
  { day: "Tue", condition: "Sunny", temp: "30° / 23°" },
  { day: "Wed", condition: "Cloudy", temp: "27° / 21°" },
  { day: "Thu", condition: "Rain", temp: "26° / 20°" },
  { day: "Fri", condition: "Sunny", temp: "29° / 22°" },
];

export const stages = [
  { name: "Preparation", status: "done" },
  { name: "Planting", status: "done" },
  { name: "Growth", status: "active" },
  { name: "Harvest", status: "upcoming" },
];
