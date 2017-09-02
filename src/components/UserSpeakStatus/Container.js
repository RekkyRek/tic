import '../../assets/css/SpeakStatus/Container.sass';
import React, { Component } from 'react';

import Channel from './Channel';
import * as ClientActions from '../../actions/Client';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colSize: 250,
      channels: [],
      users: [],
      whoami: {}
    }
  }

  handleUpdate() {
    const s = this.props.store;    
    this.setState({ channels: s.channels, whoami: s.whoami, users: s.users })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.whoami.cid != this.state.whoami.cid) {
      ClientActions.getUsers(this.state.whoami.cid)
    }
  }

  componentWillMount() {
    const store = this.props.store;
    this.setState({ channels: store.channels, whoami: store.whoami, users: store.users })

    store.on('update', this.handleUpdate.bind(this))

    setTimeout(()=>{
      ClientActions.getUsers(this.state.whoami.cid)
    }, 75);

    const client = this.props.client;

    setTimeout(()=>{
      client.notifyOn('notifyclientupdated', 'schandlerid=1', ()=>{
        console.log('update')
        ClientActions.getUsers(this.state.whoami.cid);
      })
      client.notifyOn('notifyclientmoved', 'schandlerid=1', ()=>{
        console.log('update')
        ClientActions.getWhoami();
      })
    }, 200);
  }

  componentWillUnmount() {
    const store = this.props.store;
    store.removeListener('update', this.handleUpdate.bind(this));
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
          {this.state.channels.map((channel) =>
            <Channel key={channel.cid} client={this.props.client} channel={channel} whoami={this.state.whoami} users={this.state.users} />
          )}
          <div id="ghostbar" onMouseDown={this.startResize.bind(this)}></div>
        </ul>
      </div>
    );
  }
}

export default Container;
