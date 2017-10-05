import '../../assets/css/SpeakStatus/Channel.sass';
import React, { Component } from 'react';

import User from './User';
import * as ClientActions from '../../actions/Client';

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  switchTo() {
    this.props.client.send(`clientmove cid=${this.props.channel.cid} clid=${this.props.whoami.clid}`)
  }

  render() {
    const whoami = this.props.whoami;
    const channel = this.props.channel;
    const users = this.props.users;
    
    return (
      <div className="channel" onClick={this.switchTo.bind(this)}>
        <div className={channel.cid == whoami.cid ? ('channelBanner active') : ('channelBanner')}>
          <i className={channel.cid == whoami.cid ? ('ion-chatbubble-working') : ('ion-chatbubble')}/>
          <span>{channel.channel_name}</span>
        </div>
        <div className="users">
          {this.props.whoami.cid == this.props.channel.cid && users.map((user) =>
            <User key={user.client_unique_identifier} user={user} whoami={whoami}/>
          )}
        </div>
      </div>
    );
  }
}

export default Channel;
