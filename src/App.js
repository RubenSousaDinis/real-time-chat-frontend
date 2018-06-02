import React, { Component } from 'react';
import './App.css';
import Login from './components/Login'
import Chat from './components/Chat'
import WebSocketInstance from './services/WebSocket'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      username: '',
      loggedIn: false
    };
  }

  handleLoginSubmit = (username) => {
    console.log(username);
    this.setState({ loggedIn: true, username: username });
    WebSocketInstance.loginUser(username);
  }

  render() {
    const { 
      loggedIn,
      username
    } = this.state;

    return (
      <div className="App">
        { 
          loggedIn ?
          <Chat
            currentUser={username}
          />
          :
          <Login
            onSubmit={this.handleLoginSubmit}
            usernameChangeHandler={this.usernameChangeHandler}
          />
        }
      </div>
    );
  }
}
