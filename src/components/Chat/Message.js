import '../../assets/css/Chat/Message.sass';
import React, { Component } from 'react';
import twemoji from 'twemoji';
import emoji from 'node-emoji';
import * as Helpers from '../Utils/Helpers';

const fs = require('fs');
const mime = require('mime');

class Message extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      impath: '',
      innerHTML: '',
      msgImage: '',
      msgVideo: '',
      msgYoutube: '',
      imbak: '',
      loaded: false,
      shouldLoad: false,
    }
  }

  unescape(s){
    var r = String(s);
    r = r.replace(/\\s/g,  " ");	  // Whitespace
    r = r.replace(/\\p/g,  "|");    // Pipe
    r = r.replace(/\\n/g,  "\n");   // Newline
    r = r.replace(/\\f/g,  "\f");   // Formfeed
    r = r.replace(/\\r/g,  "\r");   // Carriage Return
    r = r.replace(/\\t/g,  "\t");   // Tab
    r = r.replace(/\\v/g,  "\v");   // Vertical Tab
    r = r.replace(/\\\//g, "\/");   // Slash
    r = r.replace(/\\\\/g, "\\");   // Backslash
    r = Helpers.escapeHtml(r);

    if(r.match(/\[URL\](.*?|\n)\[\/URL\]/g) != null) {
    r.match(/\[URL\](.*?|\n)\[\/URL\]/g).forEach(function(url) {
        let urll = url.length-6;
        r = r.replace(url, `<a alt="${url.substring(5, urll)}" href="${url.substring(5, urll)}">${url.substring(5, urll)}</a>`);

        let images = ['png', 'jpg', 'peg', 'gif'];
        let isurl = url.split("?")[0].substring(5, urll);
        if(images.indexOf(isurl.substring(isurl.length-3, isurl.length).toLowerCase()) > -1 && this.state.msgImage == '') {
          this.setState({ msgImage: url.substring(5, urll) });
          return;
        }
        let videos = ['mp4', 'ifv', 'ebm'];
        if(videos.indexOf(url.substring(url.length-9, urll).toLowerCase()) > -1 && this.state.msgVideo == '') {
          if(url.indexOf('imgur') > -1) {
              let nurl = url.substring(5, urll).split('.');
              nurl.pop();
              url = '[URL]' + nurl.join('.') + '.mp4';
          }
          this.setState({ msgVideo: url.substring(5, urll) });
          return;
        }
        if(url.toLowerCase().indexOf('youtube') > -1 && url.toLowerCase().indexOf('?v=') > -1 && this.state.msgYoutube == '') {
          var video_id = url.split('v=')[1];
          var ampersandPosition = video_id.indexOf('&');
          if(ampersandPosition != -1) {
              video_id = video_id.substring(0, ampersandPosition);
          } else {
              video_id = video_id.substring(0, video_id.length - 6);
          }
          this.setState({ msgYoutube: video_id + '?autoplay=1' });
          return;
        }
        if(url.toLowerCase().indexOf('youtu.be') > -1 && this.state.msgYoutube == '') {
          var video_id = url.substring(0, url.length-6).split('/').pop();
          var ampersandPosition = video_id.indexOf('?');
          if(ampersandPosition > -1) {
              video_id += '&playsinline=0&autoplay=1'
          } else {
              video_id += '?playsinline=0&autoplay=1'
          }
          this.setState({ msgYoutube: video_id });
          return;
        }
    }, this);
    }

    return r;
}

  componentDidMount() {
    let unesc = this.unescape(this.props.msg.msg);
    unesc = emoji.emojify(unesc);
    unesc = twemoji.parse(unesc);

    let impath = `${this.props.cacheDir}/clients/avatar_${Helpers.ts3_base16(this.props.msg.invokeruid)}`;

    let imseed = Math.floor(Math.random() * 360)
    let imbak = `linear-gradient(19deg, hsl(${imseed}, 98%, 56%) 0%, hsl(${imseed+15}, 100%, 56%) 100%)`
    if(!fs.existsSync(impath)) {
      impath = "";
      this.setState({ innerHTML: unesc, imbak: imbak })
      } else if(this.state.impath == ''){
      fs.readFile(impath, (err, data) => {
        if (err) throw err;
        this.setState({ innerHTML: unesc, impath: `data:${mime.lookup(impath)};base64,${data.toString('base64')}`, imbak: imbak })
      });
    }
  }

  shouldComponentUpdate(nprops,nstate) {
    return nstate != this.state;
  }

  render() {

    let name = this.props.msg.invokername;

    let ytvid;
    if(this.state.msgYoutube != '') {
      if(!this.state.shouldLoad) {
        ytvid = (
          <div className="msgMedia">
            <img className="ytPreview" src={`https://ytimg.googleusercontent.com/vi/${this.state.msgYoutube.split('?')[0]}/hqdefault.jpg`} />
            <div onClick={()=>{this.setState({ shouldLoad: true })}} className="ytPlayBtn"/>
          </div>
        )
      } else {
        ytvid = (
          <div className="msgMedia">
            <iframe
              src={"https://www.youtube.com/embed/"+this.state.msgYoutube}
              onLoad={()=>{this.setState({ loaded: true })}}
            />
          </div>
        )
      }
    }

    if(this.state.innerHTML == '') {
      return (<div className="chatMessage" />);
    }

    return (
      <div className="chatMessage">
        <div className="chatImage" style={{ background: this.state.imbak }}>
          <div style={{ background: `url(${this.state.impath}) no-repeat center center` }}></div>
        </div>
        <div className="chatText">        
          <p><b>{name}</b></p>
          <span dangerouslySetInnerHTML={{ __html: this.state.innerHTML }} />
          {this.state.msgImage != '' &&
            <div className="msgMedia">
              <img src={this.state.msgImage} onLoad={()=>{this.setState({ loaded: true })}}/>
            </div>
          }
          {this.state.msgVideo != '' &&
            <div className="msgMedia">
              <video src={this.state.msgVideo}
                onClick={(e)=>{
                  e.target.paused ? (e.target.play()) : (e.target.pause());
                }}
                preload="auto"
                autoPlay="autoplay"
                muted="muted"
                loop="loop"
                onLoad={()=>{this.setState({ loaded: true })}}
              />
            </div>
          }
          {this.state.msgYoutube != '' && this.state.msgYoutube != undefined && ytvid}
        </div>
      </div>
    );
  }
}

export default Message;
