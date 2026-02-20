import axios from "axios";

const API_URL = "http://localhost:5000/api/disease";

/* =========================
   Scan disease (JWT required)
   ========================= */
export const scanDisease = async (file, token) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(
    `${API_URL}/scan`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =========================
   Get scan history (JWT required)
   ========================= */
export const getHistory = async (token) => {
  const res = await axios.get(
    `${API_URL}/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};