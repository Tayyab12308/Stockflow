import axios from 'axios';
import { convertKeysToSnakeCase } from './util';
import { User, UserSessionDetails } from '../interfaces';

const csrfToken = document
  ?.querySelector("meta[name='csrf-token']")
  ?.getAttribute("content");

export const login = (userCredentials: UserSessionDetails) => {
  const user = convertKeysToSnakeCase(userCredentials);
  return axios.post(
    '/api/session',
    { user }, 
    {
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

export const logout = () => {
  console.log('really about to send log out now')
  return axios.delete('/api/session', {
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    }
  });
};

export const signup = (user: User) => {
  const snakeCaseData = convertKeysToSnakeCase(user);
  return axios.post('/api/users', { user: snakeCaseData }, {
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};
