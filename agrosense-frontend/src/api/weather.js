const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
console.log("Weather API key:", API_KEY);

export const getWeatherForecast = async (lat, lon) => {
  if (!lat || !lon) return null;

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weather");
  }

  return res.json();
};

export const getCurrentWeather = async (lat, lon) => {
  if (!lat || !lon) return null;

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch current weather");
  }

  return res.json();
};
