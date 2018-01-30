import React from 'react';

const KeyboardShortcuts = () => {
  return (
    <div className="keyboard-shortcuts">
      <h2>Keyboard Shortcuts</h2>
      <table>
        <tr>
          <th>When Annotating</th>
        </tr>
        <tr>
          <td>m</td>
          <td>Toggle Previous Marks</td>
        </tr>
        <tr>
          <td>a</td>
          <td>Toggle Navigate and Transcribe</td>
        </tr>
        <tr>
          <th>When Transcribing</th>
        </tr>
        <tr>
          <td>ctrl + enter</td>
          <td>Submit Classifications</td>
        </tr>
        <tr>
          <td>esc</td>
          <td>Close and Cancel Transcription Box</td>
        </tr>
      </table>
    </div>

  );
};

export default KeyboardShortcuts;
