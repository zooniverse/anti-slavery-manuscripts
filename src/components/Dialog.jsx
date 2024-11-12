import React from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';
import { connect } from 'react-redux';
import { toggleDialog } from '../ducks/dialog';
import { Utility } from '../lib/Utility';

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

  close(e) {
    this.onClose();
    return Utility.stopEvent(e);
  }

  render() {
    const width = this.props.isPrompt ? 450 : 800;
    const height = 425;
    const x = (window.innerWidth / 2) - (width / 2);
    const y = (window.innerHeight / 2) - height / 2 + window.pageYOffset;

    const defaultPosition = { x, y, height, width };
    const enableResize = this.props.enableResize ? { bottomRight: true } : false;
    const resizeClass = this.props.enableResize ? { bottomRight: 'drag-handler' } : false;
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { onClose: this.close });
    });

    return (
      <Rnd
        default={defaultPosition}
        enableResizing={enableResize}
        dragHandlerClassName={'.handle'}
        minHeight={400}
        minWidth={400}
        resizeHandlerClasses={resizeClass}
      >
        <div
          className="popup dialog"
          ref={(c) => { this.popupBody = c; }}
          onClick={(e) => { return e.target === this.popupBody && this.close(e); }}
        >
          <div className="popup-content dialog-content">
            <div className="handle">
              {this.props.title.length ? (
                <h2>{this.props.title}</h2>
              ) : false}

              {!this.props.isPrompt && (
                <button className="close-button" onClick={this.close}>X</button>
              )}
            </div>
            {children}
          </div>
        </div>
      </Rnd>
    );
  }
}

Dialog.defaultProps = {
  enableResize: true,
  isPrompt: false,
  title: '',
};

Dialog.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func,
  enableResize: PropTypes.bool,
  isPrompt: PropTypes.bool,
  title: PropTypes.string,
};

const mapStateToProps = (state) => ({
  enableResize: state.dialog.enableResize,
  isPrompt: state.dialog.isPrompt,
  title: state.dialog.title,
});

export default connect(mapStateToProps)(Dialog);
