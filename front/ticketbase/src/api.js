import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Podaj odpowiedni URL API
  withCredentials: true, // Pozwoli na przesyłanie ciasteczek
});

export default api;
