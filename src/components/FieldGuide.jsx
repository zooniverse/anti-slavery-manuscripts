import React from 'react';
import PropTypes from 'prop-types';
import { StepThrough } from 'zooniverse-react-components';
import { getSubjectLocation } from '../lib/get-subject-location';

class FieldGuide extends React.Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  renderItem(icon) {
    return (
      <div className="field-guide">
        <p>hello</p>
        <img src={icon.src} />
      </div>
    )
  }

  render() {
    return (
      <StepThrough>
        {Object.keys(this.props.icons).map((icon) => {

          return this.renderItem(this.props.icons[icon])
        })}
        <p>test</p>
      </StepThrough>
    )
  }
}

FieldGuide.defaultProps = {
  guide: {},
  icons: {}
};

FieldGuide.propTypes = {
  guide: PropTypes.object,
  icons: PropTypes.object,
};

export default FieldGuide;
