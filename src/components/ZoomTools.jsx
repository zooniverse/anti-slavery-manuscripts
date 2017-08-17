import React from 'react';
import PropTypes from 'prop-types';
import { SUBJECTVIEWER_STATE } from '../ducks/subject-viewer';

const ZoomTools = ({ viewerState, usePanTool, useZoomIn, useZoomOut }) => {
  return (
    <div className="zoom-tools">
      <button className="flat-button block" onClick={useZoomIn}>
        <i className="fa fa-plus" />
      </button>

      <button className="flat-button block" onClick={useZoomOut}>
        <i className="fa fa-minus" />
      </button>

      <button
        className={(viewerState === SUBJECTVIEWER_STATE.NAVIGATING) ? 'flat-button block selected' : 'flat-button block'}
        onClick={usePanTool}
      >
        <i className="fa fa-arrows" />
      </button>
    </div>

  );
};

ZoomTools.propTypes = {
  usePanTool: PropTypes.func,
  useZoomIn: PropTypes.func,
  useZoomOut: PropTypes.func,
  viewerState: PropTypes.string
};

export default ZoomTools;
