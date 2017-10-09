import '../../assets/css/MusicBot/Container.sass';
import React, { Component } from 'react';

import MusicButton from './Button.js';
import MusicBot from './MusicBot.js';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    }
  }

  componentWillMount() {

  }

  componentDidMount() {

  }
  
  render() {
    return (
      <div className="musicContainer">
        <MusicButton onToggle={(res)=>{this.setState({active: res})}}/>
        <MusicBot active={this.state.active}/>
      </div>
    );
  }
}

export default Container;
