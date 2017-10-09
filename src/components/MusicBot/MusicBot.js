import '../../assets/css/MusicBot/Container.sass';
import React, { Component } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:2346');

import Queue from './Queue.js';

class MusicBot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: [

      ]
    }
  }

  componentWillMount() {
    socket.on('update', this.update.bind(this));
    socket.on('play', this.play.bind(this));
  }

  update(data) {
    console.log(data)
    this.setState({queue: data});
  }

  pause() {
    console.log('pause')
    let idoc = document.getElementById('musicIframe').contentDocument.documentElement;
    idoc.getElementsByClassName('video-stream')[0].onloadstart = () => {
      console.log('loadStart')
      setTimeout(()=>{
        idoc.getElementsByClassName('video-stream')[0].pause();
      },200)
    }
    idoc.getElementsByClassName('video-stream')[0].click()
  }

  play() {
    let idoc = document.getElementById('musicIframe').contentDocument.documentElement;
    idoc.getElementsByClassName('video-stream')[0].play();
  }

  componentDidMount() {
    setTimeout(()=>{
      this.setState({ queue: this.state.queue.splice(1) })
    }, 5000);
  }
  
  render() {
    return (
      <div className={`musicBot ${this.props.active ? "active" : ""}`}>
        {
          this.state.queue.length > 0 ? (
            <iframe
              onLoad={this.pause}
              id="musicIframe"
              width="320"
              height="180"
              key={`IF_${this.state.queue[0].id}_${this.state.queue[0].added}`}
              src={`https://www.youtube.com/embed/${this.state.queue[0].id}?autoplay=0&vq=small`}
            ></iframe>
          ) : (<div />)
        }
    
        {
          this.state.queue.length > 0 ? (
            <div>
              <h1>Queue</h1>
              <Queue queue={this.state.queue}/>
            </div>
          ) : (
            <h2>Queue Empty</h2>
          )
        }
      </div>
    );
  }
}

export default MusicBot;
