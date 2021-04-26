import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AddExpense from './AddExpense';
import rootReducer from '../../../redux/reducers/reducers';

const initialState = {};

const store = createStore(rootReducer, initialState);

const Wrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

test('renders add expense modal', () => {
  render(<AddExpense />, { wrapper: Wrapper });
  const addButton = screen.getByText('Add expense');
  expect(addButton).toBeInTheDocument(); 
  const headline = screen.getByText('Add an expense');
  expect(headline).toBeInTheDocument();
  const saveButton = screen.getByText('Save');
  expect(saveButton).toBeInTheDocument(); 
});