import config from '../config';

class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
        WebSocketService.instance = new WebSocketService();
        WebSocketService.instance.connect();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
    this.state = null;
  }

  connect() {
    const path = config.API_PATH;
    console.log(path);
    this.socketRef = new WebSocket(path);
    console.log(this.socketRef);
    this.socketRef.onopen = () => {
      console.log('WebSocket open');
    };
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect();
    };
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    console.log(parsedData);
    const command = parsedData.command;
    console.log("COMMAND", command);
    if (command === 'messages') {
      this.callbacks[command](parsedData.messages);
    }
    if (command === 'new_message') {
      console.log("MESSAGE")
      this.callbacks[command](parsedData.message);
    }
  }

  loginUser(username) {
    this.sendMessage({ command: 'login', username: username });
  }

  fetchMessages(username) {
    this.sendMessage({ command: 'fetch_messages', username: username });
  }

  newChatMessage(message) {
    this.sendMessage({ command: 'new_message', from: message.from, text: message.text }); 
  }

  addCallbacks(messagesCallback, newMessageCallback) {
    this.callbacks['messages'] = messagesCallback;
    this.callbacks['new_message'] = newMessageCallback;
  }
  
  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    }
    catch(err) {
      console.log(err.message);
    }  
  }

}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
