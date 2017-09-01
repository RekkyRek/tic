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
        </div>
      </div>
    );
  }
}

export default Loader;
