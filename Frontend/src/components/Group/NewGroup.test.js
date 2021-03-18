import { render, screen } from '@testing-library/react';
import NewGroup from './NewGroup';

test('renders new group', () => {
  render(<NewGroup />);
  const headline = screen.getByText(/Invite User/i);
  expect(headline).toBeInTheDocument();
});
