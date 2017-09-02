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
        <ChatLog store={this.props.store}/>
        <Input client={this.props.client}/>
      </div>
    );
  }
}

export default Chat;
