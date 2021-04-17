import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Main from './components/Main';
import store from './redux/store/store';
// import Navbar from '.components/LandingPage/Navbar';

// App Component
class App extends Component {
  render() {
    return (
      // Use Browser Router to route to different pages
      <Provider store={store}>
        <div>
          <BrowserRouter>
            {/* App Component Has a Child Component called Main */}
            <Main />
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}
// Export the App component so that it can be used in index.js
export default App;
