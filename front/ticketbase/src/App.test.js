import { render, screen } from '@testing-library/react'; // Import funkcji do renderowania komponentów i wyszukiwania elementów w teście
import App from './App'; // Import głównego komponentu aplikacji

// Test sprawdzający, czy na stronie znajduje się link z tekstem "learn react"
test('renders learn react link', () => {
  render(<App />); // Renderowanie komponentu App
  const linkElement = screen.getByText(/learn react/i); // Wyszukiwanie elementu z tekstem "learn react" (case-insensitive)
  expect(linkElement).toBeInTheDocument(); // Sprawdzenie, czy element znajduje się w dokumencie
});
