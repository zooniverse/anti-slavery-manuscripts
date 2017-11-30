import React from 'react';
import LineAnnotation from '../images/LineAnnotation.gif';

const AnnotationReminder = () => {
  return (
    <div className="annotation-reminder__content">
      <img role="presentation" src={LineAnnotation} />
      <span>
        To create a new transcription, click below the start of the line of text
        just before the first word, then place one dot in each space between words.
      </span>
      <span>
        When you reach the end of the line, place a dot under the space just after the final word.
      </span>
      <span>
        Click the last dot again to open the transcription box.
      </span>
    </div>

  );
};

export default AnnotationReminder;
