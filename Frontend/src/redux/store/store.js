import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/reducers';

// const store = createStore(rootReducer,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const middleware = [thunk];

const initialState = {};

// redux_devtools for debugging
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// create store, reducers are functions to change store
const store = createStore(
  rootReducer,
  initialState,
  storeEnhancers(applyMiddleware(...middleware)),
);

export default store;
