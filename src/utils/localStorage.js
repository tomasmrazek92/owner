// localStorage.js
export const getItem = (key) => {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const setItem = (key, value) => {
  const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
  localStorage.setItem(key, serializedValue);
};
