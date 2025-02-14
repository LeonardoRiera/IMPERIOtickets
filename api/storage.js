// storage.js
let storedEmail = null;

export const setEmail = (email) => {
  storedEmail = email;
};

export const getEmail = () => {
  return storedEmail;
};