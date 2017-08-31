import '../../assets/css/Chat/Selector.sass';
import React, { Component } from 'react';
import Twemoji from 'react-twemoji';

class Selector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    }
  }
  up() {
    console.log(this.state.selected)
    if(this.state.selected + 1 < this.props.items.length) {
        this.setState({ selected: this.state.selected + 1 });
    } else {
        this.setState({ selected: 0 });
    }
  }
  down() {
    console.log(this.state.selected)
    if(this.state.selected - 1 > -1) {
        this.setState({ selected: this.state.selected - 1 });
    } else {
        this.setState({ selected: this.props.items.length - 1 });
    }
  }
  render() {
    return (
      <div className="selector">
        {this.props.items.map((item) =>
            <div key={item.key} className={this.props.items.indexOf(item) == this.state.selected ? 'active' : ''}>
                <Twemoji>{item.emoji}</Twemoji><span>{item.key}</span>
            </div>
        )}
      </div>
    );
  }
}

export default Selector;
