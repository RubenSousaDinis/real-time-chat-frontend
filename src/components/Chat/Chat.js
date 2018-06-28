import React, { Component } from 'react';
import './Chat.scss';

import WebSocketInstance from '../../services/WebSocket'

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.waitForSocketConnection(() => {
      WebSocketInstance.initChatUser(this.props.currentUser);
      WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
      WebSocketInstance.fetchMessages(this.props.currentUser);
    });
  }

  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(
      function () {
        // Check if websocket state is OPEN
        if (WebSocketInstance.state() === 1) {
          console.log("Connection is made")
          callback();
          return;
        } else {
          console.log("wait for connection...")
          component.waitForSocketConnection(callback);
        }
    }, 100); // wait 100 milisecond for the connection...
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const chat = this.messagesEnd;
    const scrollHeight = chat.scrollHeight;
    const height = chat.clientHeight;
    const maxScrollTop = scrollHeight - height;
    chat.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  addMessage(message) {
    this.setState({ messages: [...this.state.messages, message]});
  }

  setMessages(messages) {
    this.setState({ messages: messages.reverse()});
  }

  messageChangeHandler = (event) =>  {
    this.setState({
      message: event.target.value
    })
  }

  sendMessageHandler = (e, message) => {
    const messageObject = {
      from: this.props.currentUser,
      text: message
    };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({
      message: ''
    })
    e.preventDefault();
  }

  renderMessages = (messages) => {
    const currentUser = this.props.currentUser;
    return messages.map((message, i) => <li key={message.id} className={message.author === currentUser ? 'me' : 'him'}> <h4 className='author'>{ message.author } </h4><p>{ message.content }</p></li>);
  }

  render() {
    const messages = this.state.messages;
    const currentUser = this.props.currentUser;
    return (
      <div className='chat'>
        <div className='container'>
          <h1>Chatting as {currentUser} </h1>
          <h3>Displaying only the last 50 messages</h3>
          <ul ref={(el) => { this.messagesEnd = el; }}>
           { 
              messages && 
              this.renderMessages(messages) 
           }
          </ul>
        </div>
        <div className='container message-form'>
          <form onSubmit={(e) => this.sendMessageHandler(e, this.state.message)} className='form'>
            <input
              type='text'
              onChange={this.messageChangeHandler}
              value={this.state.message}
              placeholder='Type a Message'
              required />
            <button className='submit' type='submit' value='Submit'>
              Send
            </button>
          </form>
        </div>
      </div>
    );
  }
}
