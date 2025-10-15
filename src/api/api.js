import axios from 'axios';

const API = axios.create({
    baseURL: 'https://backend-3-87hx.onrender.com/api'
});

export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete API.defaults.headers.common['x-auth-token'];
    }
};

export const login = (credentials) => API.post('/auth/login', credentials);
export const addResult = (data) => API.post('/results/results', data); // This was already correct
export const getDashboardSummary = () => API.get('/results/dashboard-summary'); // This was already correct
export const getSubjects = () => API.get('/results/subjects'); // This was already correct
export const getStudents = () => API.get('/results/students'); // This was already correct
export const getAllResults = () => API.get('/results/results/all'); // This was already correct
