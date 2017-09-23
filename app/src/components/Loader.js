import '../assets/css/Loading/Loading.sass';

import React, { Component } from 'react';

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    setTimeout(()=>{
      if(this.refs.reload != undefined) {
        this.refs.reload.className = "reload show";
      }
    }, 2500);
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
        <div className="reload" ref={"reload"}>
          <span>Not loading? Try</span> <a href="#" onClick={() => require("electron").remote.getCurrentWindow().reload()}>Reloading</a>
        </div>
      </div>
    );
  }
}

export default Loader;
