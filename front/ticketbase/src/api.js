import axios from 'axios';

// Utwórz instancję axios z domyślną konfiguracją
const api = axios.create({
  baseURL: 'http://localhost:8000', // Bazowy URL API
  withCredentials: true, // Wysyłanie ciasteczek z każdym żądaniem
});

export default api; // Eksport instancji axios do użycia w aplikacji
