import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Login from './Login';
import rootReducer from '../../redux/reducers/reducers';

const initialState = {};

const store = createStore(rootReducer, initialState);

const Wrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

test('renders user login page', async () => {
  render(<Login />, { wrapper: Wrapper});
  const headline = screen.getByText(/Log In/);
  expect(headline).toBeInTheDocument();
  const email = screen.getByPlaceholderText('name@example.com');
  expect(email).toBeInTheDocument();
  const button = screen.getByText('Submit');
  expect(button).toBeInTheDocument();
});

test('displays entered text in email field', async () => {
  render(<Login />, { wrapper: Wrapper});
  const emailInput = screen.getByPlaceholderText('name@example.com');
  fireEvent.change(emailInput, {
    target: { value: 'eddie@gmail.com' },
  });
  const emailUpdatedInput = screen.getByDisplayValue('eddie@gmail.com');
  expect(emailUpdatedInput).toBeInTheDocument();
});
