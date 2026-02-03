export const getActiveField = () => {
  try {
    const field = localStorage.getItem("activeField");
    return field ? JSON.parse(field) : null;
  } catch {
    return null;
  }
};

export const setActiveField = (field) => {
  localStorage.setItem("activeField", JSON.stringify(field));
};

export const clearActiveField = () => {
  localStorage.removeItem("activeField");
};
