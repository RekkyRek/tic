import React, { Component } from 'react';

class MusicButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        active: false,
    }
  }
  
  render() {
    return (
    <div className="musicButton" onClick={() => {
        this.props.onToggle(!this.state.active);
        this.setState({active: !this.state.active})}
    }>
        <i className="ion-music-note" />
      </div>
    );
  }
}

export default MusicButton;
