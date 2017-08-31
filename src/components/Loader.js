import '../assets/css/Loading/Loading.sass';

import React, { Component } from 'react';

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidUpdate() {
    
  }
  checkRunning() {
    this.props.checkToken();
  }
  render() {
    return (
      <div className="loading">
        <div className="spinner">
            <i className="ion-plus-round"></i>
            <h3>Connecting</h3>
        </div>
      </div>
    );
  }
}

export default Loader;
