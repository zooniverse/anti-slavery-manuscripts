import React from 'react';
import PropTypes from 'prop-types';
import Rnd from 'react-rnd';
import { connect } from 'react-redux';
import { toggleDialog } from '../ducks/dialog';

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.popupBody = null;
    this.close = this.close.bind(this);
  }

  onClose() {
    this.props.dispatch(toggleDialog(null));
    // if (this.props.selectedAnnotation) {
    //   this.props.dispatch(unselectAnnotation());
    // }
  }

  render() {
    const width = 600;
    const height = 400;
    const x = window.innerWidth / 2 - (width / 2);
    const y = window.innerHeight / 2 - (height / 2) + window.scrollY;

    const defaultPosition = { x, y, height, width };

    return (
      <Rnd
        default={defaultPosition}
        enableResizing={{ bottomRight: true }}
        minHeight={400}
        minWidth={400}
        resizeHandlerClasses={{ bottomRight: "drag-handler" }}
      >
        <div className="popup dialog" ref={(c)=>{this.popupBody=c}} onClick={(e) => { return e.target === this.popupBody && this.close(e); }}>
          <div className="popup-content dialog-content">
            <button className="fa fa-close close-button" onClick={this.close}></button>
            {this.props.children}
          </div>
        </div>
      </Rnd>
    );
  }

  close(e) {
    this.onClose();
    return this.stopEvent(e);
  }

  stopEvent(e) {
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.returnValue = false;
    e.cancelBubble = true;
    return false;
  }
}

Dialog.propTypes = {
  dispatch: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    dialog: state.dialog.data,
  };
};

export default connect(mapStateToProps)(Dialog);
