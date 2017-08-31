import '../../assets/css/Chat/ChatLog.sass';
import React, { Component } from 'react';

import Message from './Message';

class ChatLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
  }

  getUser(arr, value) {
    for (var i=0, iLen=arr.length; i<iLen; i++) {
      if (arr[i].client_unique_identifier == value) return arr[i];
    }
  }

  componentDidUpdate(nextProps, nextState) {
    if(this.props.users.length > 0 && nextState != this.state && this.state.messages.length > 0) {
      let logs = {};
      if(localStorage.getItem('msglogs') != undefined) {
        logs = JSON.parse(localStorage.getItem('msglogs'));
      }

      logs[this.props.users[0].cid.toString()] = this.state.messages;

      localStorage.setItem('msglogs', JSON.stringify(logs));
    }
  }

  componentWillMount() {
    if(localStorage.getItem('msglogs') != undefined) {
      let msgloop = setInterval(()=>{
        if(this.props.users.length > 0) {
          let logs = JSON.parse(localStorage.getItem('msglogs'))[this.props.users[0].cid.toString()];
          clearInterval(msgloop)
          this.setState({ messages: logs })
        }
      }, 50)
    }

    let reso = (res) => {
      let msg = this.props.client.parse(res.toString());
      msg.time = Date.now();

      this.setState({ messages: [...this.state.messages.slice(Math.max(this.state.messages.length - 49, 0)), msg] })
      
    };
    this.props.client.notifyOn('notifytextmessage','schandlerid=1', reso.bind(this));
  }

  scrollBottom() {
      let cl = document.getElementsByClassName('chatLog')[0];
      if(cl != undefined) {
        cl.scrollTop = cl.clientHeight + cl.scrollHeight;
      } else {
        setTimeout(()=>{
          this.scrollBottom();
        }, 100);
      }
  }

  componentDidMount() {
    this.scrollBottom()
  }

  render() {
    let users = this.props.users;
    console.time('render')
    if(this.props.users.length > 0) {
      let cl = document.getElementsByClassName('chatLog')[0]
      let lms = document.getElementsByClassName('chatMessage');
      if(cl != undefined && lms.length > 0) {
        let chouldScroll = cl.scrollHeight - cl.clientHeight - cl.scrollTop < lms[lms.length-1].clientHeight;
        setTimeout(()=>{
          if(chouldScroll) {
            cl.scrollTop = cl.clientHeight + cl.scrollHeight;
          }
        }, 50)
      } else {
        setTimeout(()=>{
          cl = document.getElementsByClassName('chatLog')[0]
          cl.scrollTop = cl.clientHeight + cl.scrollHeight;
        }, 50);
      }
      
      return (
        <div className="chatLog">
            {this.state.messages.map((msg) =>
              <Message key={`${msg.msg.substr(8)}_${msg.time}`} msg={msg} user={this.getUser(users, msg.invokeruid)} cacheDir={this.props.cacheDir}/>
            )}
            {console.timeEnd('render')}
        </div>
      );
    }
    return(<div className="chatLog"/>);
  }
}

export default ChatLog;
