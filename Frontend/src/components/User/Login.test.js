import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Login from './Login';
import rootReducer from '../../js/reducers/reducers';

const initialState = {};

const store = createStore(rootReducer, initialState);

const Wrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

test('renders group expense page', () => {
  render(<Login />, { wrapper: Wrapper });
  const headline = screen.getByText(/Log In/);
  expect(headline).toBeInTheDocument();
});
