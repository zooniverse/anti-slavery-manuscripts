import React from 'react';
import PropTypes from 'prop-types';
import { Utility } from '../lib/Utility';

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.popupBody = null;
    this.close = this.close.bind(this);
  }

  render() {
    return (
      <div className={`popup modal ${this.props.className}`} ref={(c)=>{this.popupBody=c}} onClick={(e) => { return e.target === this.popupBody && this.close(e); }}>
        <div className="popup-title modal-title">
          <button className="fa fa-close close-button" onClick={this.close}></button>
        </div>
        <div className="popup-content modal-content">
          {this.props.children}
        </div>
      </div>
    );
  }

  close(e) {
    this.props.onClose && this.props.onClose();
    return Utility.stopEvent(e);
  }
}

Popup.propTypes = {
  onClose: PropTypes.func,
  className: PropTypes.string,
};

Popup.defaultProps = {
  onClose: null,
  className: '',
};

export default Popup;
