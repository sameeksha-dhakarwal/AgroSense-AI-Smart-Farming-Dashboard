export const parseDailyForecast = (forecast) => {
  if (!forecast?.list) return [];

  const days = {};

  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; // YYYY-MM-DD

    if (!days[date]) {
      days[date] = {
        temp: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].main,
      };
    }
  });

  return Object.entries(days)
    .slice(0, 5)
    .map(([date, data]) => ({
      date,
      ...data,
    }));
};
