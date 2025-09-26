import axios from 'axios';

const API = axios.create({
    baseURL: 'https://backend-production-19e1.up.railway.app/'
});

export const addResult = (data) => API.post('/results', data);
export const getDashboardSummary = () => API.get('/dashboard-summary');
export const getSubjects = () => API.get('/subjects');
export const getStudents = () => API.get('/students');
export const getAllResults = () => API.get('/results/all');
