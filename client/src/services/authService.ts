import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auth`;

export const loginUser = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const getUserProfile = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/me`, config);
  return response.data;
};
