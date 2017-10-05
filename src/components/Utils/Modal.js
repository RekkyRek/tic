import '../../assets/css/Utils/Modal.sass';

import React, { Component } from 'react';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidUpdate() {
    
  }
  open() {
    this.refs.modal.className="modal";
  }
  close() {
    this.refs.modal.className="modal modalClose";
    setTimeout(()=>{
        this.refs.modal.className="modal modalHidden";
    },300)
  }
  render() {
    return (
        <div className="modal modalHidden" ref="modal">
            <div className="modalCard">
                {this.props.children}
            </div>
        </div>
    );
  }
}

export default Modal;
