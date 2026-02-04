import { useEffect, useState } from "react";
import { getWeatherForecast } from "../api/weather";
import { getActiveField } from "../utils/activeField";
import { parseDailyForecast } from "../utils/parseWeather";

export default function ForecastCard() {
  const [days, setDays] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const field = getActiveField();
    if (!field?.location?.latitude) return;

    const loadWeather = async () => {
      try {
        const raw = await getWeatherForecast(
          field.location.latitude,
          field.location.longitude
        );
        const parsed = parseDailyForecast(raw);
        setDays(parsed);
      } catch (err) {
        setError("Weather unavailable");
      }
    };

    loadWeather();
  }, []);

  return (
    <div className="bg-white border rounded-2xl p-5">
      <h3 className="font-semibold mb-4">5-Day Forecast</h3>

      {error && (
        <div className="text-sm text-gray-500">{error}</div>
      )}

      {!error && days.length === 0 && (
        <div className="text-sm text-gray-500">
          Loading forecast...
        </div>
      )}

      <div className="grid grid-cols-5 gap-4">
        {days.map((d) => (
          <div
            key={d.date}
            className="rounded-xl bg-gray-50 p-4 text-center"
          >
            <div className="text-xs text-gray-500">
              {new Date(d.date).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </div>

            <img
              src={`https://openweathermap.org/img/wn/${d.icon}@2x.png`}
              alt=""
              className="mx-auto"
            />

            <div className="font-semibold">
              {Math.round(d.temp)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
