import React from 'react';
import Rnd from 'react-rnd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { collaborateWithAnnotation, updateText, deleteSelectedAnnotation } from '../ducks/annotations';
import { updatePreviousAnnotation, reenablePreviousAnnotation } from '../ducks/previousAnnotations';

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
    this.saveText = this.saveText.bind(this);
    this.deleteAnnotation = this.deleteAnnotation.bind(this);
    this.textModifier = this.textModifier.bind(this);
    this.cancelAnnotation = this.cancelAnnotation.bind(this);
    this.renderWordCount = this.renderWordCount.bind(this);

    this.state = {
      annotationText: '',
      disableSubmit: true,
      previousTranscriptionAgreement: false,
      previousTranscriptionSelection: false,
      showAnnotationOptions: false
    }
  }

  componentDidMount() {
    let text = '';
    if (this.props.annotation.details) {
      text = this.props.annotation.details[0].value;
    }
    this.setState({ annotationText: text });
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
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({
        type: 'click-dropdown',
        timestamp: new Date().toISOString()
      });
    }

    const showAnnotationOptions = !this.state.showAnnotationOptions;
    this.setState({ showAnnotationOptions });
  }

  chooseAnnotationText(annotationText) {
    this.setState({
      annotationText,
      previousTranscriptionAgreement: true,
      previousTranscriptionSelection: true,
      showAnnotationOptions: false
    });

    this.wordCount(annotationText);
    if (this.inputText) this.inputText.value = annotationText;

  }

  textModifier(textTag) {
    let value;
    let textAfter;
    let textInBetween;

    const startTag = '[' + textTag + ']';
    const endTag = '[/' + textTag + ']';
    const text = this.inputText;
    const textAreaValue = text.value;
    const selectionStart = text.selectionStart;
    const selectionEnd = text.selectionEnd;
    const textBefore = textAreaValue.substring(0, selectionStart);
    if (selectionStart === selectionEnd) {
      textAfter = textAreaValue.substring(selectionStart, textAreaValue.length);
      if (textTag === 'unclear') {
        value = textBefore + startTag + textAfter;
      } else {
        value = textBefore + startTag + endTag + textAfter;
      }
    } else {
      textInBetween = textAreaValue.substring(selectionStart, selectionEnd);
      textAfter = textAreaValue.substring(selectionEnd, textAreaValue.length);
      if (textTag === 'unclear') {
        value = textBefore + startTag + textInBetween + textAfter;
      } else {
        value = textBefore + startTag + textInBetween + endTag + textAfter;
      }
    }

    const startReg = `(?=\\w*)\\[${textTag}\\]\\s*`;
    const endReg = `\\s*\\[\\/${textTag}\\](?=\\w*)`;
    const unclearReg = `(?=\\w*)\\[unclear\\](?=\\w*)`;

    const padStart = new RegExp(startReg, 'ig');
    const padEnd = new RegExp(endReg, 'ig');
    const unclearPad = new RegExp(unclearReg, 'ig');

    const paddedText = value.replace(padStart, ` [${textTag}]`).replace(padEnd, `[/${textTag}] `).replace(unclearPad, ' [unclear] ').replace(/\s+/g, ' ');
    this.inputText.value = paddedText;
  }

  render() {
    if (!this.props.annotation || !this.props.annotationPanePosition) return null;

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

    const inputClass = this.props.annotation.previousAnnotation ? "selected-annotation__previous" : "selected-annotation__user";

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
            <button className="close-button" onClick={this.props.onClose}>X</button>
          </div>
          <span>
            Enter the words you marked in the order you marked them. Open the
            dropdown menu to use previous volunteers' transcriptions as a starting
            point.
          </span>

          <div className="selected-annotation__markup">
            <p>Text Modifiers</p>
            <button onClick={this.textModifier.bind(this, 'insertion')}>[insertion]</button>
            <button onClick={this.textModifier.bind(this, 'deletion')}>[deletion]</button>
            <button onClick={this.textModifier.bind(this, 'unclear')}>[unclear]</button>
            <button onClick={this.textModifier.bind(this, 'underline')}>[underline]</button>
          </div>

          <p>
            <input className={inputClass} type="text" ref={(c)=>{this.inputText=c}} onChange={this.onTextUpdate} value={this.state.annotationText} />

            {this.props.annotation.previousAnnotation && (
              <button onClick={this.toggleShowAnnotations}>
                &#9660;
              </button>
            )}

          </p>

          {this.state.showAnnotationOptions && (
            this.renderAnnotationOptions()
          )}

          {!this.state.showAnnotationOptions && (
            this.renderWordCount()
          )}

          <div className="selected-annotation__buttons">
            <button className="done-button" disabled={this.state.disableSubmit} onClick={this.saveText}>Done</button>
            <button onClick={this.cancelAnnotation}>Cancel</button>
            {(this.props.annotation.previousAnnotation) ? null :
              <button onClick={this.deleteAnnotation}>Delete</button>
            }
          </div>
        </div>
      </Rnd>
    );
  }

  cancelAnnotation() {
    if (this.props.onClose) { this.props.onClose() };

    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'cancel-transcription' });
    }
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

  renderWordCount() {
    const expectedWords = this.props.selectedAnnotation.points.length - 1;
    const text = this.inputText ? this.inputText.value : "";
    const cleaned_text = text.replace(/\s+/g, ' ').trim();
    const number_of_words = cleaned_text ? cleaned_text.split(' ').length : 0;
    const style = expectedWords === number_of_words ? "selected-annotation--green" : "selected-annotation--red";

    return (
      <span className={style}>
        {number_of_words} of {expectedWords} words typed.
        Your word count must match the number of dots minus one.
      </span>
    )
  }

  saveText() {
    if (this.props.annotation.previousAnnotation) {
      this.props.dispatch(collaborateWithAnnotation(this.props.annotation, this.state.annotationText));
      this.props.dispatch(updatePreviousAnnotation(this.props.selectedAnnotationIndex));
    } else {
      this.props.dispatch(updateText(this.state.annotationText));
    }

    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'finish-annotation' });
    }

    if (this.context.googleLogger && this.state.previousTranscriptionSelection) {
      this.context.googleLogger.logEvent({ type: 'select-previous-annotation' });
    }

    this.props.onClose();
  }

  deleteAnnotation() {
    this.props.dispatch(reenablePreviousAnnotation());
    this.props.dispatch(deleteSelectedAnnotation());
    this.props.onClose();  //Note that deleteSelectedAnnotation() also runs unselectAnnotation(), but this needs to be called anyway to inform the parent component.
  }

  onTextUpdate() {
    if (!this.inputText) return;

    if (!this.inputText.value && this.state.previousTranscriptionSelection) {
      this.setState({ previousTranscriptionSelection: false });
    }

    this.setState({
      annotationText: this.inputText.value,
      previousTranscriptionAgreement: false,
    });

    this.wordCount(this.inputText.value);
  }

  wordCount(text) {
    const cleaned_text = text.replace(/\s+/g, ' ').trim();
    const number_of_words = cleaned_text.split(' ').length;
    const dots = this.props.selectedAnnotation.points.length;
    const correctLength = number_of_words === dots - 1;
    if (correctLength) {
      this.setState({ disableSubmit: false });
    }
    else if (!this.state.disableSubmit && !correctLength) {
      this.setState({ disableSubmit: true });
    }
  }
}

SelectedAnnotation.defaultProps = {
  annotationPanePosition: {
    x: 0,
    y: 0,
  },
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
  rotation: PropTypes.number,
  scaling: PropTypes.number,
  selectedAnnotationIndex: PropTypes.number,
  translationX: PropTypes.number,
  translationY: PropTypes.number,
  viewerSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
}

SelectedAnnotation.contextTypes = {
  googleLogger: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const sv = state.subjectViewer;
  return {
    annotationPanePosition: state.annotations.annotationPanePosition,
    rotation: sv.rotation,
    scaling: sv.scaling,
    selectedAnnotation: state.annotations.selectedAnnotation,
    selectedAnnotationIndex: state.annotations.selectedAnnotationIndex,
    translationX: sv.translationX,
    translationY: sv.translationY,
    viewerSize: sv.viewerSize,
    imageSize: sv.imageSize
  };
};

export default connect(mapStateToProps)(SelectedAnnotation);
