//import '../../assets/css/SpeakStatus/Container.sass';
import React, { Component } from 'react';
import * as Helpers from '../Utils/Helpers';

const fs = require('fs')
const mime = require('mime')

class BottomBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      me: {},
      impath: ""
    }
  }

  handleUpdate() {
    const s = this.props.store;
    let myuser;
    s.users.forEach(function(user) {
        if(user.clid == s.whoami.clid) {
            myuser = user;
            return;
        }
    }, this);
    this.setState({ me: myuser })
    this.mountImage();
  }

  componentWillMount() {
    const s = this.props.store;
    let myuser;

    s.users.forEach(function(user) {
        if(user.clid == s.whoami.clid) {
            myuser = user;
            return;
        }
    }, this);

    console.log('state', myuser)

    s.on('update', this.handleUpdate.bind(this))
  }

  mountImage() {
    let impath = "";
    if(this.state.impath == '' && this.state.me != {}) {
        impath = `${this.props.store.cacheDir}/clients/avatar_${Helpers.ts3_base16(this.state.me.client_unique_identifier)}`;
        console.log('impath', impath)
        if(!fs.existsSync(impath)) {
            impath = "";
        } else if(this.state.impath == ''){
            fs.readFile(impath, (err, data) => {
                if (err) throw err;
                this.setState({ impath: `data:${mime.lookup(impath)};base64,${data.toString('base64')}` })
            });
        }
    }
  }

  componentWillUnmount() {
    const store = this.props.store;
    store.removeListener('update', this.handleUpdate.bind(this));
  }
  
  render() {
    if(this.state.impath == '') {
        return (<div style={this.props.style} className="bottomBar" />);
    }
    return (
      <div style={this.props.style} className="bottomBar">
            <div className="chatImage">
                <div style={{ background: `url(${this.state.impath}) no-repeat center center` }}></div>
            </div>
            <p>{this.state.me.client_nickname}</p>
      </div>
    );
  }
}

export default BottomBar;
