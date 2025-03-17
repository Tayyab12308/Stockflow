import axios from 'axios';
import { convertKeysToSnakeCase } from './util';

const csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");

export const login = (user) => {
  const snakeCaseData = convertKeysToSnakeCase(user);
  return axios.post(
    '/api/session',
    { user: snakeCaseData }, 
    {
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
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
  return axios.post('/api/users', { user: snakeCaseData }, {
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};
