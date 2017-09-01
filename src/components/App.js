import '../assets/css/App.sass';
import React, { Component } from 'react';

import ClientStore from '../stores/Client';
import * as ClientActions from '../actions/Client';

console.log(ClientActions)

import fs from 'fs';

import UserSpeakStatus from './UserSpeakStatus/Container';
import Chat from './Chat/Container';
import Loader from './Loader';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStateReady: false,
      client: {},
      cacheDir: '',
      users: [],
      images: {}
    }
  }

  componentWillMount() {
    ClientStore.on('registered', ()=>{
      console.log('reg')
      this.setState({ client: ClientStore.client, isStateReady: true })
      console.log(this.state);
    })

    ClientActions.registerClient();
  }
  render() {
    return (
      <div>
        {this.state.isStateReady ? (
          <div id="mainApp">
            <UserSpeakStatus client={this.state.client}/>
            <Chat/>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

export default App;
