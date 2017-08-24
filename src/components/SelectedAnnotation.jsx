import React from 'react';
import Rnd from 'react-rnd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PANE_WIDTH = 800;
const PANE_HEIGHT = 260;
const BUFFER = 10;

class SelectedAnnotation extends React.Component {
  constructor(props) {
    super(props);
    this.inputText = null;
    this.onTextUpdate = this.onTextUpdate.bind(this);
  }

  render() {
    if (!this.props.annotation) return null;

    const panePosition = this.props.annotationPanePosition;
    const rotation = -this.props.rotation / 180 * Math.PI;

    let inputX = panePosition.x - this.props.imageSize.width / 2;
    let inputY = panePosition.y - this.props.imageSize.height / 2;

    const tmpX = inputX;
    const tmpY = inputY;
    inputX = tmpX * Math.cos(rotation) + tmpY * Math.sin(rotation);
    inputY = tmpY * Math.cos(rotation) - tmpX * Math.sin(rotation);

    inputX = inputX * this.props.scaling + (this.props.translationX * this.props.scaling);
    inputX = inputX + this.props.viewerSize.width / 2;

    inputY = inputY * this.props.scaling + (this.props.translationY * this.props.scaling);
    inputY = inputY + this.props.viewerSize.height / 2;


    const defaultPosition = {
      x: inputX - (PANE_WIDTH / 2),
      y: inputY + BUFFER,
      width: PANE_WIDTH,
      height: PANE_HEIGHT,
    };

    return (
      <Rnd
        default={defaultPosition}
        enableResizing={{ bottomRight: true }}
        minHeight={PANE_HEIGHT}
        minWidth={500}
        resizeHandlerClasses={{ bottomRight: "drag-handler" }}
        style={{backgroundColor: 'white' }}
      >
        <div className="selected-annotation">
          <div>
            <h2>Transcribe</h2>
            <button className="fa fa-close close-button" onClick={this.props.onClose}></button>
          </div>
          <span>
            Enter the words you marked in the order you marked them. Open the
            dropdown menu to use previous volunteers' transcriptions as a starting
            point.
          </span>
          <p>
            <input type="text" ref={(c)=>{this.inputText=c}} onChange={this.onTextUpdate} value={this.props.annotation.text} />
          </p>
          <div className="selected-annotation__buttons">
            <button>Done</button>
            <button onClick={this.props.onClose}>Cancel</button>
          </div>
        </div>
      </Rnd>
    );
  }

  onTextUpdate() {
    if (!this.inputText) return;

    //TODO
    //WARNING WARNING
    //This isn't the 'correct' way to update redux.annotations.annotations.
    //We should have a a 'save' button that calls a special function
    //ducks/annotations.updateAnnotation(selectedAnnotation, newText)
    //That updates the Redux store.
    //This little hack only works because of the way pointers work in JS.
    this.props.annotation.text = this.inputText.value;
    this.forceUpdate();  //See, by changing the values via direct pointers,
                         //sure, we change the data in the Redux store, but
                         //nobody else knows the store has been updated -
                         //not even this component!
  }
}

SelectedAnnotation.defaultProps = {
  rotation: 0,
  scaling: 1,
  translationX: 0,
  translationY: 0,
}

SelectedAnnotation.propTypes = {
  annotationPanePosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  dispatch: PropTypes.func,
  onClose: PropTypes.func,
  rotation: PropTypes.number,
  scaling: PropTypes.number,
  translationX: PropTypes.number,
  translationY: PropTypes.number,
  viewerSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
}

const mapStateToProps = (state, ownProps) => {
  const sv = state.subjectViewer;
  return {
    annotationPanePosition: state.annotations.annotationPanePosition,
    rotation: sv.rotation,
    scaling: sv.scaling,
    selectedAnnotation: state.annotations.selectedAnnotation,
    translationX: sv.translationX,
    translationY: sv.translationY,
    viewerSize: sv.viewerSize,
    imageSize: sv.imageSize
  };
};

export default connect(mapStateToProps)(SelectedAnnotation);
