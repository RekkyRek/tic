import '../../assets/css/Chat/ChatLog.sass';
import React, { Component } from 'react';

import * as ClientActions from '../../actions/Client';
import Message from './Message';

class ChatLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
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

  componentWillMount() {
    const store = this.props.store;
    const client = this.props.client;
    store.on('update', ()=>{
      this.setState({ messages: store.messages[store.whoami.cid] })
    })

    let reso = (res) => {
      let msg = this.props.client.parse(res.toString());
      console.log(msg)
    };

    this.props.client.notifyOn('notifytextmessage', 'schandlerid=1', reso.bind(this));
    window.ts3 = this.props.client;
    console.log(window)
  }

  componentWillUnmount() {
    const client = this.props.client;
    client.notifyOff('notifytextmessage', 'schandler=1');
  }

  componentDidMount() {
    this.scrollBottom()
  }

  render() {
    console.time('render')
    if(0 > 0) {
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
            {/*this.state.messages.map((msg) =>
              <Message key={`${msg.msg.substr(8)}_${msg.time}`} msg={msg} user={this.getUser(users, msg.invokeruid)} cacheDir={this.props.cacheDir}/>
            )*/}
        </div>
      );
    }
    return(<div className="chatLog"/>);
  }
}

export default ChatLog;
