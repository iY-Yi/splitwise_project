import { render, screen } from '@testing-library/react';
import Profile from './Profile';

test('renders user profile', () => {
  render(<Profile />);
  const headline = screen.getByText(/Your account/i);
  expect(headline).toBeInTheDocument();
});
