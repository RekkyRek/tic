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

  componentWillMount() {

  }
  render() {
    let isStateReady = true;
    return (
      <div>
        {isStateReady ? (
          <div id="mainApp">
            <UserSpeakStatus/>
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
