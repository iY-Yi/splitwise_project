import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Signup from './Signup';
import rootReducer from '../../js/reducers/reducers';

const initialState = {};

const store = createStore(rootReducer, initialState);

const Wrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

test('renders group expense page', () => {
  render(<Signup />, { wrapper: Wrapper });
  const headline = screen.getByText(/New User/);
  expect(headline).toBeInTheDocument();
});
