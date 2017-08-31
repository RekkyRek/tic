import '../assets/css/App.sass';
import React, { Component } from 'react';

import tssc from '/media/hampus/Anis/ts3-clientquery/';
import fs from 'fs';

import UserSpeakStatus from './UserSpeakStatus/Container';
import Chat from './Chat/Container';
import Loader from './Loader';

const client = tssc.newQuery()

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: { state: 0 },
      cacheDir: '',
      users: [],
      images: {}
    }
  }
  componentDidUpdate() {
    if(this.state.client.state == 3 && this.state.cacheDir == '') {
      client.request('servervariable virtualserver_unique_identifier')
        .then((res)=>{
          console.log(res.toString())
          const cacheDir = `${require('os').homedir()}/.ts3client/cache/${btoa(client.parse(res.toString()).virtualserver_unique_identifier)}`;
          setTimeout(()=>{
            this.setState({ cacheDir })
          },50)
        })
    }
  }
  setUsers(users) {
    console.log('setusers', users)
    this.setState({ users })
  }
  componentWillMount() {
    console.log('127.0.0.1', '25639', localStorage.getItem('ts3token'))
    client.connect('127.0.0.1', '25639', localStorage.getItem('ts3token'))
      .then((res)=>{
        setTimeout(()=>{
          console.log(res)
          this.setState({ client: res })
        },0)
      })
  }
  render() {
    const isStateReady = this.state.client.state == 3 && this.state.cacheDir != '';
    console.log('stat', this.state.client.state == 3 && this.state.cacheDir != '', this.state)
    return (
      <div>
        {isStateReady ? (
          <div id="mainApp">
            <UserSpeakStatus client={client} setUsers={this.setUsers.bind(this)}/>
            <Chat client={client} cacheDir={this.state.cacheDir} users={this.state.users}/>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

export default App;
