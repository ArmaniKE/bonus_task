import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    this.state = {
      chats: [],
      selectedChat: null,
      newMessage: '',
      messages: storedMessages,
      newUser: '',
      selectedUser: null,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(users => {
        this.setState({ chats: users });
      })
      .catch(error => console.error('Error fetching chats:', error));
  };

  fetchMessages = (receiverId) => {
    fetch(`http://localhost:3000/messages?receiverId=${receiverId}`)
      .then(response => response.json())
      .then(messages => {
      
        this.setState(prevState => ({
          selectedChat: {
            ...prevState.selectedChat,
            messages: messages
          }
        }));
      })
      .catch(error => console.error('Error fetching messages:', error));
  };

  selectChat = (chat) => {
    fetch(`http://localhost:3000/messages?receiverId=${chat.id}`)
      .then(response => response.json())
      .then(messages => {
        this.setState({ selectedChat: { ...chat, messages } });
      })
      .catch(error => console.error('Error fetching messages:', error));
  };

  handleInputChange = (e) => {
    this.setState({ newMessage: e.target.value });
  };

  handleSendMessage = () => {
    const { selectedChat, newMessage, messages } = this.state;
    if (!selectedChat || !newMessage.trim()) return;

    const latestId = messages.length > 0 ? messages[messages.length - 1].id : 0;
    const newId = String(parseInt(latestId, 10) + 1);

    const newMessageObject = {
      id: newId,
      senderId: "2",
      receiverId: selectedChat.id,
      text: newMessage,
    };

    const updatedMessages = [...messages, newMessageObject];

    localStorage.setItem('messages', JSON.stringify(updatedMessages));

    this.setState(
      {
        messages: updatedMessages,
        selectedChat: { ...selectedChat, messages: updatedMessages },
        newMessage: '',
      },
      () => {
        this.fetchMessages(selectedChat.id);
      }
    );

    fetch('http://localhost:3000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessageObject),
    })
      .then(response => response.json())
      .then(data => console.log('Message sent:', data))
      .catch(error => console.error('Error sending message:', error));
  };

  handleNewUserChange = (e) => {
    this.setState({ newUser: e.target.value });
  };

  handleAddUser = () => {
    const { newUser } = this.state;
    if (!newUser.trim()) return;
  
    const newUserId = String(this.state.chats.length + 1);
    const newUserObject = { id: newUserId, name: newUser };

    this.setState(
      {
        chats: [...this.state.chats, newUserObject],
        newUser: '',
      },
      () => {
        this.fetchUsers();
  
        fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUserObject),
        })
          .then(response => response.json())
          .then(data => {
            console.log('User added:', data);
            window.location.reload();
          })
          .catch(error => console.error('Error adding user:', error));
      }
    );
  };
  
  render() {
    const { chats, selectedChat, newMessage, newUser } = this.state;

    return (
      <div className="App">
        <div className="chats">
          <h2>Chats</h2>
          <ul>
            {chats.map(chat => (
              <li key={chat.id} onClick={() => this.selectChat(chat)}>
                {chat.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="chat">
          {selectedChat ? (
            <div>
              <h2>{selectedChat.name}</h2>
              <div className="messages">
                {selectedChat.messages.map(message => (
                  <div key={message.id} className="message">
                    {message.text}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Select any chat</p>
          )}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={this.handleInputChange}
          />
          <button onClick={this.handleSendMessage}>Send</button>
        </div>
        <div className="login-container">
          <h3>New User</h3>
          <input
            type="text"
            placeholder="Enter new user name..."
            value={newUser}
            onChange={this.handleNewUserChange}
          />
          <button onClick={this.handleAddUser}>Add User</button>
        </div>
      </div>
    );
  }
}

export default App;
