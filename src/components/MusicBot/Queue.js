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
          {
            this.props.queue.map((qi)=>
              <div key={`${qi.id}_${qi.added}`} className={`queueItem ${this.props.queue.indexOf(qi) == 0 ? 'current' : ''}`}>{qi.title}</div>
            )
          }
      </div>
    );
  }
}

export default Queue;
