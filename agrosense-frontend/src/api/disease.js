import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const scanDisease = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${API_URL}/predict`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data;
};
