export const API_BASE_URL = "http://localhost:5000";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const api = async (url, method = "GET", data = null, token = null) => {
  const res = await fetch(API_BASE_URL + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : null,
  });

  return res.json();
};

export const authApi = (url, method = "GET", data = null) => {
  const token = getToken();
  return api(url, method, data, token);
};

/* =========================
   READINGS (Old System)
========================= */
export const getLatestReading = (fieldId) =>
  authApi(`/api/readings/latest/${fieldId}`);

export const getWeeklyReadings = (fieldId) =>
  authApi(`/api/readings/weekly/${fieldId}`);

export const addReading = (data) =>
  authApi("/api/readings", "POST", data);

/* =========================
   ✅ NEW — Soil Moisture Logs (Correct Route)
========================= */
export const getWeeklySoilMoisture = (fieldId) =>
  authApi(`/api/fields/${fieldId}/weekly-moisture`);

/* =========================
   SOIL
========================= */
export const analyzeSoil = (data) =>
  authApi("/api/soil/analyze", "POST", data);

/* =========================
   IRRIGATION
========================= */
export const getIrrigationAdvice = (data) =>
  authApi("/api/irrigation/recommend", "POST", data);

/* =========================
   DISEASE
========================= */
export const scanDisease = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    "http://localhost:5000/api/disease/scan",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    }
  );

  return res.json();
};

/* =========================
   MARKET
========================= */
export const getMarketForecast = (data) =>
  authApi("/api/market/forecast", "POST", data);

/* =========================
   FIELDS
========================= */
export const getFields = () =>
  authApi("/api/fields");