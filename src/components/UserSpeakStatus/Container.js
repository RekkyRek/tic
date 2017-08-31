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
      channels: [],
      users: [],
      whoami: {},
      listener: null,
      colSize: 250,
    }
  }
  getUsers(whoami) {
    console.log('getUsewrs', whoami)
    this.props.client.request(`channelclientlist cid=${whoami.cid} -voice -uid`)
      .then((res)=>{
        console.log('usersGet', Array.isArray(this.props.client.parse(res)))
        if(Array.isArray(this.props.client.parse(res))) {
          this.setState({ users: this.props.client.parse(res) })
          this.props.setUsers(this.props.client.parse(res))
        } else {
          console.log('usersOne',  [...[this.props.client.parse(res)]])
          this.setState({ users: [...[this.props.client.parse(res)]] })
          this.props.setUsers([...[this.props.client.parse(res)]])
        }
        console.log(this.state)
        this.mountListeners();
      })
  }
  mountListeners() {
    this.props.client.notifyOn('notifyclientleftview', 'schandlerid=1', this.componentWillMount.bind(this))
    this.props.client.notifyOn('notifycliententerview', 'schandlerid=1', this.componentWillMount.bind(this))
    this.props.client.notifyOn('notifyclientmoved', 'schandlerid=1', this.componentWillMount.bind(this))
  }
  updateChannelsFunc (res) {
    console.log('channellist')
    if(res == undefined) {res = ()=>{};}
    const client = this.props.client;
    console.log(Object.keys(this.state.whoami).length)
    

    console.log('state', this.state)
    
    client.request('channellist')
    .then((re)=>{
      console.log(client.parse(re))
      console.log('state', this.state)
      client.request('whoami')
        .then((ress)=>{
          console.log(re.toString())
          this.setState({ whoami: client.parse(ress), channels: client.parse(re) })
          console.log(this.state)
          res({ whoami: client.parse(ress), channels: client.parse(re) })
        })
    })
  }
  componentWillMount() {
    const client = this.props.client;
    this.updateChannelsFunc((res)=>{
      console.log('res', res)
      setTimeout(()=>{
        this.getUsers(res.whoami)
      }, 100)
    });
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
    const channels = this.state.channels;
    const whoami = this.state.whoami;
    return (
      <div onMouseUp={this.stopResize.bind(this)}>
        <ul className="channels" style={{ width: this.state.colSize }}>
          {channels.map((channel) =>
            <Channel client={this.props.client} key={channel.cid} channel={channel} whoami={whoami} users={this.state.users}/>
          )}
          <div id="ghostbar" onMouseDown={this.startResize.bind(this)}></div>
        </ul>
      </div>
    );
  }
}

export default Container;
