import React, { Component } from 'react';

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
  }
  componentWillMount() {
    
  }
  render() {
    const whoami = this.props.whoami;
    const user = this.props.user;
    const isTalking = user.client_flag_talking == 0 ? (false) : (true);
    const isMicMute = user.client_input_muted == 0 ? (false) : (true);
    const isOutMute = user.client_output_muted == 0 ? (false) : (true);

    let icon = 'ion-mic-a';
    
    if(isTalking) { icon = 'ion-mic-a active'; }
    if(isMicMute) { icon = 'ion-android-microphone-off'; }
    if(isOutMute) { icon = 'ion-android-volume-off'; }

    return (
      <div className="user">
        <i
            className={icon}
        />
        <span>{user.client_nickname}</span>
      </div>
    );
  }
}

export default User;
