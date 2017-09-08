import React from 'react';
import Rnd from 'react-rnd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PANE_WIDTH = 800;
const PANE_HEIGHT = 260;
const BUFFER = 10;

const ENABLE_DRAG = "handle selected-annotation";
const DISABLE_DRAG = "selected-annotation";

class SelectedAnnotation extends React.Component {
  constructor(props) {
    super(props);
    this.inputText = null;
    this.onTextUpdate = this.onTextUpdate.bind(this);
    this.toggleShowAnnotations = this.toggleShowAnnotations.bind(this);

    this.state = {
      annotationText: '',
      showAnnotationOptions: false
    }
  }

  componentDidMount() {
    this.inputText.addEventListener('mousedown', () => {
      this.dialog.className = DISABLE_DRAG;
    });
    this.inputText.addEventListener('mouseup', () => {
      this.dialog.className = ENABLE_DRAG;
    });
  }

  componentWillUnmount() {
    this.inputText.removeEventListener('mousedown', () => {
      this.dialog.className = DISABLE_DRAG;
    });
    this.inputText.removeEventListener('mouseup', () => {
      this.dialog.className = ENABLE_DRAG;
    });
  }

  toggleShowAnnotations() {
    const showAnnotationOptions = !this.state.showAnnotationOptions;
    this.setState({ showAnnotationOptions });
  }

  chooseAnnotationText(annotationText) {
    this.setState({ annotationText, showAnnotationOptions: false });
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
    };

    return (
      <Rnd
        default={defaultPosition}
        dragHandlerClassName={'.handle'}
        enableResizing={{ bottomRight: true }}
        minHeight={PANE_HEIGHT}
        minWidth={500}
        resizeHandlerClasses={{ bottomRight: "drag-handler" }}
        style={{backgroundColor: 'white' }}
      >
        <div className={ENABLE_DRAG} ref={(c) => {this.dialog = c}}>
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
            <input type="text" ref={(c)=>{this.inputText=c}} onChange={this.onTextUpdate} value={this.state.annotationText} />
            {this.props.previousAnnotationSelected && (
              <button onClick={this.toggleShowAnnotations}>
                <span>
                  {this.props.annotation.textOptions.length}
                </span>
                <i className="fa fa-caret-down fa-lg"/>
              </button>
            )}
          </p>
          {this.state.showAnnotationOptions && (
            this.renderAnnotationOptions()
          )}
          {this.props.previousAnnotationSelected && !this.state.showAnnotationOptions && (
            <div className="selected-annotation__markup">
              <button>[insertion]</button>
              <button>[deletion]</button>
              <button>[unclear]</button>
            </div>
          )}
          <div className="selected-annotation__buttons">
            <button onClick={this.props.onClose}>Done</button>
          </div>
        </div>
      </Rnd>
    );
  }

  renderAnnotationOptions() {
    return (
      <div className="selected-annotation__options">
        {this.props.annotation.textOptions.map((option, i) => {
          return (
            <button onClick={this.chooseAnnotationText.bind(this, option)} key={i}>
              {option}
            </button>
          );
        })}
      </div>
    )
  }

  onTextUpdate() {
    if (!this.inputText) return;

    this.setState({ annotationText: this.inputText.value });
  }
}

SelectedAnnotation.defaultProps = {
  annotationPanePosition: {
    x: 0,
    y: 0,
  },
  previousAnnotationSelected: false,
  rotation: 0,
  scaling: 1,
  translationX: 0,
  translationY: 0,
  viewerSize: {
    width: 0,
    height: 0,
  }
}

SelectedAnnotation.propTypes = {
  annotationPanePosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  dispatch: PropTypes.func,
  onClose: PropTypes.func,
  previousAnnotationSelected: PropTypes.bool,
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
