import axios from 'axios';


// Utwórz instancję axios z domyślną konfiguracją
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

export default api;
