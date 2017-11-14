import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class CribSheet extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="collections-manager">
        <span>Hello World</span>
      </div>
    );
  }
}

CribSheet.propTypes = {
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(CribSheet);
