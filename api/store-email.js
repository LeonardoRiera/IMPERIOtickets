// storeEmail.js
let storedEmail = null;

export const saveEmail = (email) => {
  storedEmail = email;
};

export const getEmail = () => storedEmail;

export const clearEmail = () => {
  storedEmail = null;
};
