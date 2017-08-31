import '../../assets/css/SpeakStatus/Container.sass';
import React, { Component } from 'react';

import Channel from './Channel';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colSize: 250,
    }
  }

  componentWillMount() {

  }
  resize(e) {
    e.preventDefault();
    if(e.pageX - 29 > 225 && e.pageX - 29 < window.innerWidth - 128) {
      this.setState({ colSize: e.pageX - 29});
    }
  }
  startResize() {
    window.onmousemove = this.resize.bind(this);
  }
  stopResize() {
    window.onmousemove = undefined;
  }
  render() {
    return (
      <div onMouseUp={this.stopResize.bind(this)}>
        <ul className="channels" style={{ width: this.state.colSize }}>
          {/*channels.map((channel) =>
            <Channel key={channel.cid}/>
          )*/}
          <div id="ghostbar" onMouseDown={this.startResize.bind(this)}></div>
        </ul>
      </div>
    );
  }
}

export default Container;
