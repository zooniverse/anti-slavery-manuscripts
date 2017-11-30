import React from 'react';
import PropTypes from 'prop-types';

const SubjectLoading = ({ loaded }) => {
  const transform = !loaded ? 'scale(0.35)' : '';

  return (
    <g id="Already-Seen-/-messaging" transform={transform} stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="first-annotation" transform="scale(3) translate(-15, -50)" strokeWidth="2">
        <g id="Group">
          <circle id="Oval-2" stroke="#C4AFB9" cx="15" cy="15" r="15" />
          <path
            d="M15,30 C23.2842712,30 30,23.2842712 30,15
              C30,6.71572875 23.2842712,0 15,0
              C6.71572875,0 0,6.71572875 0,15"
            id="Oval-2"
            stroke="#7B5A69"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 15 15"
            to="360 15 15"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </g>
      </g>
      <text
        className="subject-loading-spinner"
        x="0" y="80" fill="#4a4a4a"
        fontFamily="Playfair Display"
        fontSize="40" textAnchor="middle"
      >
          SUBJECT LOADING
      </text>
      <line
        x1="-80" y1="150" x2="80" y2="150"
        strokeWidth="4px" stroke="#979797"
      />
    </g>
  );
};

SubjectLoading.propTypes = {
  loaded: PropTypes.bool,
};

SubjectLoading.defaultProps = {
  loaded: false,
};

export default SubjectLoading;
