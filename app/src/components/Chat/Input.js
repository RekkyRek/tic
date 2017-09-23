import '../../assets/css/Chat/Input.sass';
import React, { Component } from 'react';
import autosize from 'autosize';
import Twemoji from 'react-twemoji';
import twemoji from 'twemoji';
import emoji from 'node-emoji';

import * as Helpers from '../Utils/Helpers';

import Selector from './Selector';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '😊', '😇', '😉', '😌', '😍', '😘', '😗', '😙', '😚', '😋', '😜', '😝', '😧', '😩' ];
    this.state = {
      height: 14,
      emoji: '😄',
      text: '',
      sel: 0,
      searchRes: []
    }
  }

  componentWillMount() {
    var imgs = [];
    for (var i = 0; i < this.emojis.length; i++) {
      imgs[i] = new Image();
      let tmo = twemoji.parse(this.emojis[i]).match(/src\s*=\s*"(.+?)"/)[1];
      imgs[i].src = tmo;
    }
  }

  componentDidMount() {

  }

  handleKeyPress(e) {
    const input = document.getElementById('chatInput');
    //console.log(input.selectionStart, input.selectionEnd)
    let word = input.value.substring(0,input.selectionEnd).split(' ').pop()
    let isEmoji = false;
    if(word.indexOf(':') > -1 && word.length > 1 && word.lastIndexOf(':') == 0) {
      word = word.split(':').pop();
      isEmoji = true;
      this.setState({searchRes: emoji.search(word).splice(0, 5)})
      } else {
      this.setState({searchRes: []})
    }
    autosize(input)

    this.setState({ text: input.value, sel: input.selectionStart });

    if (e.keyCode == 38) {
      if(isEmoji) {
        e.preventDefault()
        this.refs.sel.up()
        return false;
      }
    } else if(e.keyCode == 40) {
      if(isEmoji) {
        e.preventDefault()
        this.refs.sel.down();
        return false;
      }
    } else if (e.keyCode == 13 && e.shiftKey == false) {
      let word = input.value.substring(0,input.selectionEnd);

      if(this.state.searchRes.length > 0) {
        let selemoj = this.state.searchRes[this.refs.sel.state.selected];
        let begin = word.lastIndexOf(':');
        let end = begin + `:${selemoj.key}:`.length;
        
        if(word.split(' ').pop().indexOf(':') != 0) {
          e.preventDefault()
          return false;
        }

        let newstr = input.value.substring(0, begin) + `:${selemoj.key}:` + input.value.substring(input.selectionEnd, 1024)

        input.value = newstr;
        this.setState({searchRes: []})
        console.log(word, begin, newstr)

        input.setSelectionRange(end,end);

      } else {
        const msg = `sendtextmessage targetmode=2 msg=${Helpers.escape(input.value)}`;
        input.value = "";
        this.props.client.send(msg);
        document.getElementById('chatInput').style.height="31px";
        input.value = "";
      }
      e.preventDefault()
      return false;
    }
  }
  
  render() {
    return (
      <div className="chatInput">
        {this.state.searchRes.length > 0 && <Selector ref="sel" items={this.state.searchRes}/>}
        <textarea type="text" placeholder="Message" id="chatInput" onClick={this.handleKeyPress.bind(this)} onChange={this.handleKeyPress.bind(this)} onKeyDown={this.handleKeyPress.bind(this)}/>
        <button>
          <Twemoji onMouseLeave={()=>{this.setState({ emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)] })}}>
            <span>{this.emojis[Math.floor(Math.random() * this.emojis.length)]}</span>
          </Twemoji>
        </button>
      </div>
    );
  }
}

export default Input;
