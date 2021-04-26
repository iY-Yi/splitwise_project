import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import BalanceList from './BalanceList';
import rootReducer from '../../../redux/reducers/reducers';

const initialState = {};

const store = createStore(rootReducer, initialState);

const Wrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

test('renders balance list', () => {
  render(<BalanceList />, { wrapper: Wrapper });
  const headline = screen.getByText('Group Balances');
  expect(headline).toBeInTheDocument();
});
