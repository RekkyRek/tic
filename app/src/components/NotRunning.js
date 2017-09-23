import '../assets/css/NotRunning/NotRunning.sass';
import Modal from './Utils/Modal';
import React, { Component } from 'react';

const {dialog} = require('electron').remote

class NotRunning extends React.Component {
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
  autofix() {
    this.refs.modal.open();
    if(localStorage.getItem('ts3path') != undefined) {
      this.refs.ts3file.value = localStorage.getItem('ts3path');
    }
  }
  confirm() {
    localStorage.setItem('ts3path', this.refs.ts3file.value);
    this.close();
  }
  close() {
    this.refs.modal.close();
  }
  browse() {
    dialog.showOpenDialog({properties: ['openFile']}, (files)=>{
      if(files.length == 1) {
        this.refs.ts3file.value = files[0];
      }
    })
  }
  render() {
    return (
      <div className="NotRunning">
        <Modal ref="modal">
          <h1>Launch Teamspeak</h1>
          <p>Setup Teamspeak to launch with TIC.</p>
          <input type="text" placeholder="/path/to/teamspeak.exe" ref="ts3file"></input>
          <button onClick={this.browse.bind(this)}>
                <span>Browse</span>
            </button><br/>
            <button onClick={this.close.bind(this)} style={{ marginLeft: '0px' }}>
                <span>Close</span>
            </button>
            <button onClick={this.confirm.bind(this)}>
                <span>Confirm</span>
            </button>
        </Modal>
        <div className="flextext">
            <i className="ion-help-circled"></i>
            <h1>Teamspeak not running</h1>
        </div>
        <p>Teamspeak needs to be running for TIC to connect.</p>
        <p>Please start it and hit retry when started. You can also setup teamspeak to lauch with TIC by pressing <i>Atempt Fix</i>.</p>
        <div className="buttons">
            <button onClick={this.checkRunning.bind(this)}>
                <span>Retry</span><i className="ion-refresh"></i>
            </button>
            <button onClick={this.autofix.bind(this)}>
                <span>Atempt Fix</span><i className="ion-wrench"></i>
            </button>
            <button onClick={()=>{window.location.href="https://github.com/RekkyRek/tic/issues"}}>
                <span>Report Bug</
                span><i className="ion-social-github"></i>
            </button>
        </div>
      </div>
    );
  }
}

export default NotRunning;
