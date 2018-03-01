import React from 'react';
import Rnd from 'react-rnd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Utility, KEY_CODES } from '../lib/Utility';
import { VARIANT_TYPES } from '../ducks/splits';
import { collaborateWithAnnotation, updateText, deleteSelectedAnnotation } from '../ducks/annotations';
import { updatePreviousAnnotation, reenablePreviousAnnotation } from '../ducks/previousAnnotations';

const PANE_WIDTH = 800;
const PANE_HEIGHT = 350;
const BUFFER = 10;

const ENABLE_DRAG = 'handle selected-annotation';
const DISABLE_DRAG = 'selected-annotation';

class SelectedAnnotation extends React.Component {
  constructor(props) {
    super(props);
    this.inputText = null;
    this.onTextUpdate = this.onTextUpdate.bind(this);
    this.toggleShowAnnotations = this.toggleShowAnnotations.bind(this);
    this.saveText = this.saveText.bind(this);
    this.deleteAnnotation = this.deleteAnnotation.bind(this);
    this.insertTextModifier = this.insertTextModifier.bind(this);
    this.cancelAnnotation = this.cancelAnnotation.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.checkPaneBounds = this.checkPaneBounds.bind(this);

    //Speech Recognition
    //--------------------------------
    try {
      if ('webkitSpeechRecognition' in window) {
        this.speechRecognition = new webkitSpeechRecognition();
      } else if ('SpeechRecognition' in window) {
        this.speechRecognition = new SpeechRecognition();
      }
    } catch (err) { console.error('SpeechRecognition error: ', err); }
    
    if (this.speechRecognition) {
      this.speechRecognition.onstart = (e) => {
        console.log('SpeechRecognition Start: ', e);
        this.setState({ speechStatus: 'on' });
      };
      
      this.speechRecognition.onend = (e) => {
        console.log('SpeechRecognition End: ', e);
        this.setState({ speechStatus: 'off' });
      };
      
      this.speechRecognition.onresult = (e) => {
        console.log('SpeechRecognition End: ', e);
        
        if (e && e.result) {
          console.log(e.result);
        }
      };
      
      this.speechRecognition.onerror = (e) => {
        console.error('SpeechRecognition.onerror(): ', e);
        this.setState({ speechStatus: 'error' });
      };
    }
    //--------------------------------

    this.state = {
      annotationText: '',
      previousTranscriptionAgreement: false,
      previousTranscriptionSelection: false,
      showAnnotationOptions: false,
      speechStatus: 'off',
    };
  }

  componentDidMount() {
    let text = '';
    if (this.props.annotation.details) {
      text = this.props.annotation.details[0].value;
    }
    document.addEventListener('keyup', this.handleKeyUp);
    this.setState({ annotationText: text });
    this.inputText.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  toggleShowAnnotations() {
    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({
        type: 'click-dropdown',
        timestamp: new Date().toISOString(),
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
      showAnnotationOptions: false,
    });
  }

  insertTextModifier(textTag) {
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

    this.setState({
      annotationText: this.cleanText(value),
    });
  }

  /*  cleanText() makes the user's transcription text more palatable to the
      aggregation engine.

      NOTE: cleanText() can be added to onTextUpdate() to create an
      "auto-correct as you type" feature, but boy oh boy we need to be careful
      about messing around with standard user input. (@shaun 20171107)
   */
  cleanText(text) {
    return text

    //Generic tags
    .replace(/(\[\w+\])/g, ' $1')  //When  we see [tag], add a space in front of it.
    .replace(/(\[\/\w+\])/g, ' $1')  //When  we see [/tag], add a space after it.
    .replace(/(\[\w+\])\s*([^\[])/g, '$1$2')  //When we see [tag]__word, change it to [tag]word
    .replace(/([^\]])\s*(\[\/\w+\])/g, '$1$2')  //When we see word___[/tag], change it to word[/tag]
    .replace(/\[(\w+\])\s*(\S*)\s*\[\/(\1)/g, '[$1$2[/$3')  //When we see [tag]   whatever_or_nothing   [/tag], change it to [tag]whatever_or_nothing[/tag]
    //WARNING: This code does NOT handle [tag1][tag2]nested metatags[/tag2][/tag1] properly, except for the special case.

    //TODO: verify if the following handles nested metatags:
    //.replace(/(\[\w+\])\s+(\[\w+\])/g, '$1$2')  //When we see opening tags like [tag1] [tag2], bring them together like [tag1][tag2]
    //.replace(/(\[\/\w+\])\s+(\[\/\w+\])/g, '$1$2')  //When we see closing tags like [/tag1] [/tag2], bring them together like [/tag1][/tag2]

    //Special case: [unclear]
    .replace(/(\[unclear\])/g, ' $1 ') //Add spaces before/after [unclear]
    .replace(/(\[\w+\])\s*(\[unclear\])/g, '$1$2')  //If [unclear] is between [tags][/tags], make sure there's no space before...
    .replace(/(\[unclear\])\s*(\[\/\w+\])/g, '$1$2')  //...or after it. So [tag] [unclear] [tag] becomes [tag][unclear][/tag]
    .replace(/\[unclear\]\[unclear\]/g, '[unclear] [unclear]')  //Why do you even have multiple consecutive [unclear]s? Well, we're accounting for it anyway.

    //General cleanup
    .trim()  //Remove useless spaces at the start and the end of the lines.
    .replace(/\s+/g, ' ');  //No multiple spaces.
  }

  checkPaneBounds(x, y) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight + window.pageYOffset;

    const paneHalf = PANE_WIDTH / 2;
    const helpWidth = document.getElementById('help-column').offsetWidth;
    const filmstripWidth = document.getElementById('filmstrip-column').offsetWidth;
    const zooHeaderHeight = document.getElementsByClassName('zoo-header')[0].offsetHeight;
    const projectHeaderHeight = document.getElementById('project-header').offsetHeight;

    const leftX = (x - paneHalf) + (helpWidth + filmstripWidth);
    const rightX = (x + paneHalf) + (helpWidth + filmstripWidth + BUFFER);
    const bottomY = zooHeaderHeight + projectHeaderHeight + y + PANE_HEIGHT + BUFFER;

    if (rightX - windowWidth > 0) { x = x - ((rightX + BUFFER) - windowWidth); }
    if (leftX < 0) { x = x + Math.abs(leftX); }
    if (bottomY - windowHeight > 0) { y = y - (BUFFER * 3) - (bottomY - windowHeight); }

    return { x, y };
  }

  render() {
    let instructions = 'Please transcribe all of the words in the line of text.';
    if (this.props.variant === VARIANT_TYPES.COLLABORATIVE) {
      instructions += ` Open the dropdown menu to use previous volunteers'
        transcriptions as a starting point.`;
    }
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

    const inputClass = this.props.annotation.previousAnnotation ? 'selected-annotation__previous' : 'selected-annotation__user';

    const boundPos = this.checkPaneBounds(inputX, inputY);

    const defaultPosition = {
      x: boundPos.x - (PANE_WIDTH / 2),
      y: boundPos.y + BUFFER,
      width: PANE_WIDTH,
    };

    return (
      <Rnd
        default={defaultPosition}
        dragHandlerClassName={'.handle'}
        enableResizing={{ bottomRight: true }}
        minHeight={PANE_HEIGHT}
        minWidth={500}
        resizeHandlerClasses={{ bottomRight: 'drag-handler' }}
        style={{ backgroundColor: 'white' }}
      >
        <div className={ENABLE_DRAG} ref={(c) => { this.dialog = c; }}>
          <div>
            <h2>Transcribe</h2>
            <button className="close-button" onClick={this.cancelAnnotation}>X</button>
          </div>
          <span>
            {instructions}
          </span>

          <div className="selected-annotation__markup">
            <p>Text Modifiers</p>
            <button onClick={this.insertTextModifier.bind(this, 'insertion')}>[insertion]</button>
            <button onClick={this.insertTextModifier.bind(this, 'deletion')}>[deletion]</button>
            <button onClick={this.insertTextModifier.bind(this, 'unclear')}>[unclear]</button>
            <button onClick={this.insertTextModifier.bind(this, 'underline')}>[underline]</button>
          </div>

          <p>
            <input
              className={inputClass}
              type="text"
              ref={(c) => { this.inputText = c; }}
              onChange={this.onTextUpdate}
              onMouseDown={() => { this.dialog.className = DISABLE_DRAG; }}
              onMouseUp={() => { this.dialog.className = ENABLE_DRAG; }}
              value={this.state.annotationText}
            />

            {this.props.annotation.previousAnnotation && (
              <button onClick={this.toggleShowAnnotations}>
                &#9660;
              </button>
            )}

          </p>

          {this.state.showAnnotationOptions && (
            this.renderAnnotationOptions()
          )}

          <div className="selected-annotation__buttons">
            {(!this.speechRecognition) ? null :
              <button onClick={(e)=>{
                if (this.state.speechStatus === 'off') {
                  this.speechRecognition.start();
                } else if (this.state.speechStatus === 'on') {
                  this.speechRecognition.stop();
                }
                console.log(this.state.speechStatus);
              }}>
              {(this.state.speechStatus === 'off') ? 'Voice: off' : null}
              {(this.state.speechStatus === 'on') ? 'Voice: on' : null}
              {(this.state.speechStatus === 'error') ? 'Voice: ERROR' : null}
              </button>
            }
            <button className="done-button" onClick={this.saveText}>Done</button>
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
    //Cancelling a new Annotation (i.e. it starts off with empty text) should also delete it.
    const initialAnnotationText =
      (this.props.selectedAnnotation && this.props.selectedAnnotation.details &&
       this.props.selectedAnnotation.details[0] && this.props.selectedAnnotation.details[0].value)
      ? this.props.selectedAnnotation.details[0].value : '';

    if (initialAnnotationText.trim().length === 0) {
      this.deleteAnnotation();  //Cancel this action and delete this newly created Annotation.
    } else {
      if (this.props.onClose) { this.props.onClose(); }  //Cancel this action and make no updates to the existing (and valid) Annotation.
    }

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
    );
  }

  saveText() {
    //There are two possibilities here: either the user is agreeing with a
    //Previous (Aggregated) Annotation, or the user is creating/editing their
    //own.
    if (this.props.annotation.previousAnnotation) {
      this.props.dispatch(collaborateWithAnnotation(this.props.annotation, this.state.annotationText));
      this.props.dispatch(updatePreviousAnnotation(this.props.selectedAnnotationIndex));
    } else {
      //If the newly updated annotation text is essentially blank, just delete this whole Annotation line.
      const text = (this.state.annotationText && this.state.annotationText.trim)
        ? this.state.annotationText.trim() : '';
      if (text !== '') {
        this.props.dispatch(updateText(text));
      } else {
        this.deleteAnnotation();
      }
    }

    if (this.context.googleLogger) {
      this.context.googleLogger.logEvent({ type: 'finish-annotation' });
    }

    if (this.context.googleLogger && this.state.previousTranscriptionSelection) {
      this.context.googleLogger.logEvent({ type: 'previous-annotation-agreement' });
    }

    this.props.onClose();
  }

  deleteAnnotation() {
    this.props.dispatch(reenablePreviousAnnotation());
    this.props.dispatch(deleteSelectedAnnotation());
    this.props.onClose();  //Note that deleteSelectedAnnotation() also runs unselectAnnotation(), but this needs to be called anyway to inform the parent component.
  }

  handleKeyUp(e) {
    if (Utility.getKeyCode(e) === KEY_CODES.ESCAPE) {
      this.cancelAnnotation();
    }
    if (Utility.getKeyCode(e) === KEY_CODES.ENTER && e.ctrlKey) {
      this.saveText();
    }
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
  }
}

SelectedAnnotation.defaultProps = {
  annotation: {},
  annotationPanePosition: {
    x: 0,
    y: 0,
  },
  rotation: 0,
  scaling: 1,
  selectedAnnotation: null,
  translationX: 0,
  translationY: 0,
  variant: VARIANT_TYPES.INDIVIDUAL,
  viewerSize: {
    width: 0,
    height: 0,
  },
};

SelectedAnnotation.propTypes = {
  annotation: PropTypes.shape({
    details: React.PropTypes.array,
  }),
  annotationPanePosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  dispatch: PropTypes.func,
  onClose: PropTypes.func,
  rotation: PropTypes.number,
  scaling: PropTypes.number,
  selectedAnnotation: PropTypes.shape({
    points: PropTypes.array,
  }),
  selectedAnnotationIndex: PropTypes.number,
  translationX: PropTypes.number,
  translationY: PropTypes.number,
  variant: PropTypes.string,
  viewerSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

SelectedAnnotation.contextTypes = {
  googleLogger: PropTypes.object,
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
    variant: state.splits.variant,
    viewerSize: sv.viewerSize,
    imageSize: sv.imageSize,
  };
};

export default connect(mapStateToProps)(SelectedAnnotation);
