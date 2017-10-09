import '../../assets/css/MusicBot/Container.sass';
import React, { Component } from 'react';

class Queue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {

  }

  componentDidMount() {

  }
  
  render() {
    return (
      <div className="musicQueue">
          <div className="queueItem current">Asian Jake Paul (feat. Boyinaband) *DISS TRACK*</div>
          <div className="queueItem">Post Malone feat. 21 Savage - rockstar</div>
          <div className="queueItem">One More Light (Official Video) - Linkin Park</div>
          <div className="queueItem">Post Malone - White Iverson</div>
      </div>
    );
  }
}

export default Queue;
