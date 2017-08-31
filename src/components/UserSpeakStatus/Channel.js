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
    }
  }

  render() {
    const whoami = {};
    const channel = {};
    const users = [];
    
    //console.log('users', users)

    return (
      <div className="channel">
        <div className={'channelBanner'/*channel.cid == whoami.cid ? ('channelBanner active') : ('channelBanner')>*/}>
          <i className={'ion-chatbubble'/*channel.cid == whoami.cid ? ('ion-chatbubble-working') : ('ion-chatbubble')>*/}/>
          <span>{/*channel.channel_name*/}</span>
        </div>
        <div className="users">
          {/*this.props.whoami.cid == this.props.channel.cid && users.map((user) =>
            <User key={user.clid}/>
          )*/}
        </div>
      </div>
    );
  }
}

export default Channel;
