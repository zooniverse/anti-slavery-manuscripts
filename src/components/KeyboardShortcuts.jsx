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
          <td>Ctrl + M</td>
          <td>Toggle Previous Marks</td>
        </tr>
        <tr>
          <td>Ctrl + A</td>
          <td>Toggle Navigate and Annotate</td>
        </tr>
        <tr>
          <th>When Transcribing</th>
        </tr>
        <tr>
          <td>Ctrl + Enter</td>
          <td>Submit Classifications</td>
        </tr>
        <tr>
          <td>Escape</td>
          <td>Close and Cancel Transcription Box</td>
        </tr>
      </table>
    </div>

  );
};

export default KeyboardShortcuts;
