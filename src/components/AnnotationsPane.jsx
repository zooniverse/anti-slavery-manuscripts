/*
Annotations Pane
----------------

TODO: Description

NOTE: we've adjusted the (0,0) origin of the SVG to the CENTRE, instead of the
default top left. Please review SubjectViewer.jsx, SVGImage.jsx and
AnnotationsPane.jsx for details.
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class AnnotationsPane extends React.Component {
  constructor(props) {
    super(props);
  }

  //----------------------------------------------------------------

  render() {
    const imageOffset = `translate(${-this.props.imageSize.width/2}, ${-this.props.imageSize.height/2})`;
    
    return (
      <g transform={imageOffset}>
        <g>
          <circle cx={0} cy={0} r={100} fill="#3c9" />
        </g>
      </g>
    );
  }
}

AnnotationsPane.propTypes = {
  imageSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

AnnotationsPane.defaultProps = {
  imageSize: {
    width: 0,
    height: 0,
  },
};
