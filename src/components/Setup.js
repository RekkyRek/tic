import '../assets/css/Setup/Setup.sass';
import React, { Component } from 'react';

import fs from 'fs';
import { Dots, Slides } from 'react-infinite-slide';

class Setup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: '',
    }

  }
  componentWillMount() {
      /*setInterval(()=>{
          this.slide.onSlideRight();
      }, 1000)*/
  }

  validate() {
    let str = this.state.value;
    console.log(str)
    console.log(this.state)
    if(str.split('-').length != 6) {
        return false;
    } else if(str.length != 29) {
        return false;
    }
    localStorage.setItem('ts3token', str);
    setTimeout(()=>{
        console.log(this.props)
        this.props.checkToken();
    },500);
  }
  render() {
      console.log('render')
    return (
      <div>
        <Slides
            dots={Dots}
            duration={300}
            ref={(slide) => {this.slide = slide;}}
        >
            <div className="slide" id="welcome">
                <h1>TeamSpeak Improved Client</h1>
                <button onClick={()=>{this.slide.onSlideRight()}}>
                    <span>Setup</span><i className="ion-chevron-right"></i>
                </button>
            </div>
            <div className="slide" id="plugin">
                <h1>Prerequisites</h1>
                <p>Make sure you have the <a href="http://forum.teamspeak.com/threads/66509-Official-ClientQuery-Plugin">ClientQuery</a> plugin installed, <i>it should be installed and enabled by default</i>.</p>
                <button onClick={()=>{this.slide.onSlideRight()}}>
                    <span>Next</span><i className="ion-chevron-right"></i>
                </button>
            </div>
            <div className="slide" id="token">
                <h1>Access Token</h1>
                <p>We need your ClientQuery access token to be able to interface with the TeamSpeak client.</p>
                <p>It can be found by <b>pressing Alt+P</b> in TeamSpeak then going to <b>Addons</b> and clicking the <b>Settings Button</b> on <b>ClientQuery</b>.</p>
                <input type="text" placeholder="AAAA-BBBB-CCCC-DDDD-EEEE-FFFF" maxLength="29" id="tokenInput" onKeyUp={(e)=>{this.setState({ value: e.target.value })}}></input>
                <button onClick={this.validate.bind(this)}>
                    <span>Finish</span><i className="ion-achevron-right"></i>
                </button>
            </div>
        </Slides>
      </div>
    );
  }
}

export default Setup;
