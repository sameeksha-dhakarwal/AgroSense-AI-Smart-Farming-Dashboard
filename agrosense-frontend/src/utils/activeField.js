export const setActiveField = (field) => {
  localStorage.setItem("activeField", JSON.stringify(field));
};

export const getActiveField = () => {
  const f = localStorage.getItem("activeField");
  return f ? JSON.parse(f) : null;
};
