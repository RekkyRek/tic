import '../../assets/css/Chat/Message.sass';
import React, { Component } from 'react';
import twemoji from 'twemoji';
import emoji from 'node-emoji';

const ord = require('/media/hampus/Anis/phpord');
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
      loaded: false,
      shouldLoad: false,
    }
  }

  ts3_base16(stri) {
    var str = require('atob')(stri);
    var convert = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
    var ret = '';
    for (var i = 0; i < 20; i++) {
      var ch = ord(str.charAt(i));
      ret += convert[(ch & 0xF0) >> 4];
      ret += convert[ch & 0x0F];
    }
    return ret;
  }

  componentWillMount() {
    let unesc = this.unescape(this.props.msg.msg);
    unesc = emoji.emojify(unesc);
    unesc = twemoji.parse(unesc);
    this.setState({ innerHTML: unesc })
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

    if(r.match(/\[URL\](.*?|\n)\[\/URL\]/g) != null) {
      r.match(/\[URL\](.*?|\n)\[\/URL\]/g).forEach(function(url) {
        let urll = url.length-6;
        r = r.replace(url, `<a alt="${url.substring(5, urll)}" href="${url.substring(5, urll)}">${url.substring(5, urll)}</a>`);

        let images = ['png', 'jpg', 'peg', 'gif'];
        if(images.indexOf(url.substring(url.length-9, urll).toLowerCase()) > -1 && this.state.msgImage == '') {
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

  render() {
    let impath;
    if(this.props.user != undefined) {
      impath = `${this.props.cacheDir}/clients/avatar_${this.ts3_base16(this.props.user.client_unique_identifier)}`;
      if(!fs.existsSync(impath)) {
        impath = "";
      } else if(this.state.impath == ''){
        fs.readFile(impath, (err, data) => {
          if (err) throw err;
          this.setState({ impath: `data:${mime.lookup(impath)};base64,${data.toString('base64')}` })
        });
      }
    } else {
      impath = '';
    }
    let name;
    if(this.props.user != undefined) {
      name = this.props.user.client_nickname;
    } else {
      name = "Unknown User";
    }

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

    return (
      <div className="chatMessage">
        <div className="chatImage">
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
