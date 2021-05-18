import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Main from './components/Main';
import store from './js/store/store';
// import Navbar from '.components/LandingPage/Navbar';

// apollo client setup
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
});

// App Component
class App extends Component {
  render() {
    return (
      // Use Browser Router to route to different pages
      <Provider store={store}>
        <ApolloProvider client={client}>
          <BrowserRouter>
            <div>
              {/* App Component Has a Child Component called Main */}
              <Main />
            </div>
          </BrowserRouter>
        </ApolloProvider>
      </Provider>
    );
  }
}
// Export the App component so that it can be used in index.js
export default App;
