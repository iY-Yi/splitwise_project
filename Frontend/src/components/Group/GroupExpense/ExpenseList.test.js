import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ExpenseList from './ExpenseList';
import rootReducer from '../../../redux/reducers/reducers';

const initialState = {};

const store = createStore(rootReducer, initialState);

const Wrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

test('renders expense list', () => {
  render(<ExpenseList />, { wrapper: Wrapper });
  const headline = screen.getByText('Expenses');
  expect(headline).toBeInTheDocument();
});
