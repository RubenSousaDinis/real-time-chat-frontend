import React, { Component } from 'react';
import './Chat.scss';

import WebSocketInstance from '../../services/WebSocket'

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
    WebSocketInstance.fetchMessages(this.props.currentUser);
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
