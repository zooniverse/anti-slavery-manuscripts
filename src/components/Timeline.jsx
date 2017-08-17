import React from 'react';
import PropTypes from 'prop-types';
import timelineEvents from '../lib/timeline-events';

class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.timeline = null;
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.state = {
      hoverBox: null,
      hoverIndex: null,
      timelineWidth: 100
    }
  }

  componentDidMount() {
    if (this.timeline) {
      const width = this.timeline.getBoundingClientRect().width;
      this.setState({ timelineWidth: width })
    }
  }

  dateFinder(date) {
    let startDate = date;
    const TIMELINE_LENGTH = 120;
    const BEGINNING_YEAR = 1800;
    let yearWidth = 3;
    let color = 'black';

    if (date.includes('-')) {
      const dates = date.split(/\s*-\s*/)
      startDate = dates[0];
      const yearDifference = dates[1] - dates[0];
      yearWidth = yearDifference / TIMELINE_LENGTH * this.state.timelineWidth;
      color = 'gray'
    }

    const percentagePlace = (startDate - BEGINNING_YEAR) / TIMELINE_LENGTH * 100;

    return {
      placement: `${percentagePlace}%`,
      width: yearWidth,
      color
    }
  }

  handleMouseEnter(e) {
    this.setState({ hoverIndex: e.target.getAttribute('data-index') })
  }

  handleMouseLeave() {
    this.setState({ hoverIndex: null })
  }

  renderEvent(event, i) {
    const position = this.dateFinder(event.year);
    let lineSize = {
      y1: "50",
      y2: "70"
    }

    if (this.state.hoverIndex == i) {
      lineSize.y1 = "45",
      lineSize.y2 = "75"
    }

    return (
      <a key={i}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <line data-index={i} ref={(c) => {this.test = c;} } x1={position.placement} y1={lineSize.y1} x2={position.placement} y2={lineSize.y2} strokeWidth={position.width} stroke={position.color} />
        <text x="0" y="35" fill="grey" style={{ display: 'none' }}>
          bleh
        </text>
      </a>
    )
  }

  render() {
    return (
      <div className="timeline" ref={(c)=>this.timeline=c}>
        <svg width="100%" height="300" viewBox={`0 0 ${this.state.timelineWidth} 300`}>
          <text x="0" y="35" fill="grey">
            1800
          </text>
          <text textAnchor="end" x={50 / 120 * this.state.timelineWidth} y="35" fill="grey">
            1850
          </text>
          <text textAnchor="end" x={100 / 120 * this.state.timelineWidth} y="35" fill="grey">
            1900
          </text>
          <line x1="0" y1="55" x2="0" y2="65" strokeWidth="5" stroke="gray" />
          <line x1="0" y1="60" x2="100%" y2="60" strokeWidth="1" stroke="gray" />
          <line x1="100%" y1="55" x2="100%" y2="65" strokeWidth="5" stroke="gray" />
          {timelineEvents.map((event, i) => {
            return this.renderEvent(event, i)
          })}
          <text textAnchor="end" x="100%" y="35" fill="grey">
            1920
          </text>
        </svg>
        <span className="footnote">Click a line to learn more about the date</span>
      </div>
    );
  }
};

Timeline.propTypes = {
};

export default Timeline;
