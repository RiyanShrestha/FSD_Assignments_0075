import { render, screen } from '@testing-library/react';
import App from './App';

test('renders amazon clone logo text', () => {
  render(<App />);
  const logoElement = screen.getAllByText(/amazon/i);
  expect(logoElement.length).toBeGreaterThan(0);
});

