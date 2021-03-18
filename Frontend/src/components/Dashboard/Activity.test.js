import { render, screen } from '@testing-library/react';
import Dashboard from './Activity';

test('renders activity', () => {
  render(<Dashboard />);
  const headline = screen.getByText(/Recent activity/i);
  expect(headline).toBeInTheDocument();
});
