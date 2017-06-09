import React from 'react';

class TmpSvgIcon extends React.Component {
  render() {
    const width = (this.props.width) ? (this.props.width) : 20;
    const height = (this.props.height) ? (this.props.height) : 20;
    
    return (
      <svg width={width} height={height}>
        <circle
          cx={width/2}
          cy={height/2}
          r={width * 0.45}
          stroke="#5c5c5c"
          strokeWidth="1"
          fill="none"
        />
        <line
          x1={0}
          y1={height}
          x2={width}
          y2={0}
          stroke="#5c5c5c"
          stroke-width="1"
        />
      </svg>
    );
  }
}

export default TmpSvgIcon;
