import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// PROFILE
export const getProfile = (userId) => API.get(`/profile/${userId}`);

export const updateProfile = (userId, data) =>
  API.put(`/profile/${userId}`, data);

export const createTeacherProfile = (data) => API.post(`/profile`, data);

export const createStaffProfile = (data) => API.post(`/profile`, data);

export const getAllStaff = () => API.get(`/profile/all`);

export const deleteStaff = (userId) => API.delete(`/profile/${userId}`);

// PHOTO
export const uploadPhoto = (userId, formData) =>
  API.post(`/profile/${userId}/photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// DOCUMENTS
export const getDocuments = (userId) => API.get(`/documents/${userId}`);

export const uploadDocument = (userId, formData) =>
  API.post(`/documents/${userId}`, formData);

export const deleteDocument = (docId) => API.delete(`/documents/${docId}`);

export default API;
