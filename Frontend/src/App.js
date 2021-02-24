import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Main from './components/Main';

// App Component
class App extends Component {
  render() {
    return (
      // Use Browser Router to route to different pages
      <BrowserRouter>
        <div>
          {/* App Component Has a Child Component called Main */}
          <Main />
        </div>
      </BrowserRouter>
    );
  }
}
// Export the App component so that it can be used in index.js
export default App;
