import '../../assets/css/Chat/Container.sass';
import React, { Component } from 'react';

import Input from './Input';
import ChatLog from './ChatLog';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentWillMount() {

  }

  render() {
    return (
      <div className="chat">
        <ChatLog client={this.props.client} users={this.props.users} cacheDir={this.props.cacheDir}/>
        <Input client={this.props.client}/>
      </div>
    );
  }
}

export default Chat;
