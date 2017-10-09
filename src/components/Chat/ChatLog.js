import '../../assets/css/Chat/ChatLog.sass';
import React, { Component } from 'react';

import * as ClientActions from '../../actions/Client';
import Message from './Message';
import * as Helpers from '../Utils/Helpers';

class ChatLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      users: [],
      avatars: {},
      cacheDir: undefined,
      cid: 0,
    }
  }

  scrollBottom() {
      let cl = document.getElementsByClassName('chatLog')[0];
      if(cl != undefined && cl.childNodes.length > 0) {
        cl.scrollTop = cl.clientHeight + cl.scrollHeight;
      } else {
        setTimeout(this.scrollBottom, 100);
      }
  }

  componentWillMount() {
    let store = this.props.store;
    const client = this.props.client;
    store.on('update', () => {
      store = this.props.store;
      if(store.messages[store.whoami.cid] == this.state.messages) {
        return;
      }
      setTimeout(()=> {
        store = this.props.store;
        this.setState({
          cid: store.whoami.cid,
          messages: store.messages[store.whoami.cid],
          cacheDir: store.cacheDir,
          users: store.users
        }) 
      }, 100);
    });
    store.on('msgupdate', () => {
      store = this.props.store;
      this.setState({
        cid: store.whoami.cid,
        messages: store.messages[store.whoami.cid],
        cacheDir: store.cacheDir,
        users: store.users
      })
    })

    let reso = (res) => {
      let msg = this.props.client.parse(res.toString());
      ClientActions.putMessages(this.state.cid, msg)
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
    setTimeout(this.scrollBottom, 350);
  }

  getUser(users, uid) {
    let retur = null;
    users.forEach(function(user) {
      if(user.client_unique_identifier == uid) {
        retur = user;
      }
    }, this);
    return retur;
  }

  render() {    
    if(this.state.cacheDir == undefined) {
      ClientActions.updateCache();
      return (<div className="chatLog"/>);
    }

    if(this.state.messages && this.state.users && this.state.messages.length > 0 && this.state.users.length > 0) {
      let cl = document.getElementsByClassName('chatLog')[0]
      let lms = document.getElementsByClassName('chatMessage');
      if(cl != undefined && lms.length > 0) {
        let chouldScroll = cl.scrollHeight - cl.clientHeight - cl.scrollTop < lms[lms.length-1].clientHeight;
        console.log(chouldScroll)
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

      //console.log('chat lol', this.state.messages)

      return (
        <div className="chatLog">
            {this.state.messages.map((msg) =>
              <Message key={`${msg.time}`} msg={msg} user={this.getUser(this.state.users, msg.invokeruid)} cacheDir={this.state.cacheDir}/>
            )}
        </div>
      );
    }
    
    return (<div className="chatLog"/>);
  }
}

export default ChatLog;
