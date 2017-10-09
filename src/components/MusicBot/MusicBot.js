import '../../assets/css/MusicBot/Container.sass';
import React, { Component } from 'react';

import Queue from './Queue.js';

class MusicBot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: [
        {id: "qGgIC1GkBCw"},
        {id: "3zMUJwGrn6Q"},
      ]
    }
  }

  componentWillMount() {

  }

  pause() {
    let idoc = document.getElementById('musicIframe').contentDocument.documentElement;
    idoc.getElementsByClassName('video-stream')[0].onloadstart = () => {
      setTimeout(()=>{
        idoc.getElementsByClassName('video-stream')[0].pause();
      },100)
    }
    idoc.getElementsByClassName('video-stream')[0].click()
  }

  componentDidMount() {
    setTimeout(()=>{
      this.setState({ queue: this.state.queue.splice(1) })
    }, 5000);
  }
  
  render() {
    return (
      <div className={`musicBot ${this.props.active ? "active" : "active"}`}>
        <iframe onLoad={this.pause} id="musicIframe" width="320" height="180" src={`https://www.youtube.com/embed/${this.state.queue[0].id}?autoplay=0`}></iframe>
        <h1>Queue</h1>
        <Queue />
      </div>
    );
  }
}

export default MusicBot;
