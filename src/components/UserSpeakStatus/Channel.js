import '../../assets/css/SpeakStatus/Channel.sass';
import React, { Component } from 'react';

import User from './User';

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    }
  }

  mountListeners() {
    if(this.props.whoami.cid == this.props.channel.cid) {
      this.props.client.notifyOn('notifytalkstatuschange','schandlerid=1', (res) => {
        let udat = this.props.client.parse(res);
        let users = this.state.users;
        this.state.users.forEach(function(user) {
          if(user.clid == udat.clid) {
            users[users.indexOf(user)].client_flag_talking = udat.status;
          }
        }, this);
        this.setState({ users: users })
      })
    } else {
      setTimeout(()=>{this.mountListeners()}, 100);
    }
  }
  unmountListeners() {
    this.props.client.notifyOff('notifytalkstatuschange','schandlerid=1')
  }

  componentWillUpdate(nextProps) {
    //console.log('nextProps', nextProps, nextProps.users[0], this.state.users[0])
    if(nextProps.users.length != this.state.users.length || nextProps.users.length > 0 && nextProps.users[0].cid != this.state.users[0].cid) {
      this.setState({ users: nextProps.users })
      if(this.props.channel.cid == this.props.whoami.cid) {
        setTimeout(()=>{this.mountListeners()}, 100);
      }
    }
  }

  componentWillMount() {
    if(this.props.channel.cid == this.props.whoami.cid) {
      this.mountListeners();
    }
  }
  componentWillUnmount() {
    this.unmountListeners();
  }
  changeChannel() {
    const p = this.props;
    console.log('switch to '+p.channel.channel_name)
    this.props.client.send(`clientmove cid=${p.channel.cid} clid=${p.whoami.clid}`)
  }
  render() {
    const whoami = this.props.whoami;
    const channel = this.props.channel;
    const users = this.state.users;
    
    //console.log('users', users)

    return (
      <div className="channel" onClick={this.changeChannel.bind(this)}>
        <div className={channel.cid == whoami.cid ? ('channelBanner active') : ('channelBanner')}>
          <i className={channel.cid == whoami.cid ? ('ion-chatbubble-working') : ('ion-chatbubble')}/>
          <span>{channel.channel_name}</span>
        </div>
        <div className="users">
          {this.props.whoami.cid == this.props.channel.cid && users.map((user) =>
            <User key={user.clid} user={user} whoami={whoami}/>
          )}
        </div>
      </div>
    );
  }
}

export default Channel;
