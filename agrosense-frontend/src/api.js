
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
