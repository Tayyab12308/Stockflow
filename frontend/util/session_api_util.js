import axios from 'axios';
import { convertKeysToSnakeCase } from './util';

const csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");

// Helper function to serialize the "user" object as Rails expects.
const serializeUser = (user) => {
  const params = new URLSearchParams();
  // Rails expects nested params like user[name]=John
  Object.entries(user).forEach(([key, value]) => {
    params.append(`user[${key}]`, value);
  });
  return params;
};

export const login = (user) => {
  const data = serializeUser(user);
  return axios.post('/api/session', data, {
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const logout = () => {
  return axios.delete('/api/session', {
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    }
  });
};

export const signup = (user) => {
  const snakeCaseData = convertKeysToSnakeCase(user);
  const data = serializeUser(snakeCaseData);
  return axios.post('/api/users', data, {
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};
