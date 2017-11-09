import React from 'react';
import PropTypes from 'prop-types';
import timelineEvents from '../lib/timeline-events';
import Text from './Text';

const collectionGroups = [{
  years: "1820-1840",
  width: "50"
}, {
  years: "1840-1860",
  width: "100"
}, {
  years: "1860-1880",
  width: "70"
}, {
  years: "1880-1900",
  width: "10"
}];

class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.timeline = null;
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.renderText = this.renderText.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);

    this.state = {
      activeEvent: null,
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
    let yearWidth = 4;
    let color = 'black';

    if (date.includes('-')) {
      const dates = date.split(/\s*-\s*/)
      startDate = dates[0];
      const yearDifference = dates[1] - dates[0];
      yearWidth = yearDifference / TIMELINE_LENGTH * this.state.timelineWidth;
      if (yearDifference > 10) { color = 'grey' }
    }

    const percentagePlace = (startDate - BEGINNING_YEAR) / TIMELINE_LENGTH * this.state.timelineWidth;

    return {
      placement: percentagePlace,
      width: yearWidth,
      color
    }
  }

  handleMouseEnter(data) {
    this.setState({ activeEvent: data })
  }

  handleMouseLeave() {
    this.setState({ clickIndex: null })
  }

  handleKeyPress(data, e) {
    if (e.keyCode === 13) {
      this.handleMouseEnter(data);
    }
  }

  handleOnBlur() {
    this.setState({ activeEvent: null });
  }

  renderEvent(event, i) {
    const position = this.dateFinder(event.year);
    const clicked = this.state.clickIndex == i ? true : false;
    const data = { x: position.placement, event: event, i };

    return (
      <g key={i} tabIndex={0} onKeyUp={this.handleKeyPress.bind(this, data)} onBlur={this.handleOnBlur} transform={`translate(${position.placement}, ${60})`} onMouseDown={this.handleMouseEnter.bind(this, data)} >
        <line
          ref={(c) => {this.test = c;} }
          className="event-line"
          x1="0" x2={position.width}
          y1="0" y2="0"
          stroke={position.color}
          strokeWidth="25"
        />
      </g>
    )
  }

  renderText() {
    const data = this.state.activeEvent
    const anchor = data.i == timelineEvents.length - 1 ? 'end' : 'start';

    return (
      <Text textAnchor={anchor} x={data.x} y={100} year={data.event.year} width={200}>
        {data.event.text}
      </Text>
    )
  }

  renderGroups(group, i) {
    const test = this.dateFinder(group.years);

    return (
      <g key={i}>
        <line x1={test.placement} y1="60" x2={test.placement + test.width} y2="60" strokeWidth={group.width} stroke="#F4F0E7" />
      </g>
    )
  }

  render() {
    return (
      <div className="timeline" ref={(c)=>this.timeline=c}>
        <span className="about-the-collection__content">The tan box illustrates a bar graph of items in the collection.</span>

        <svg x="0" y="0" width="100%" preserveAspectRatio="xMinYMin meet" height="350" viewBox={`0 0 ${this.state.timelineWidth} 350`} xmlSpace="preserve">
          <g className="timeline__bar">

            {collectionGroups.map((group, i) => {
              return this.renderGroups(group, i)
            })}

            <text id="shape" x="0" y="35" fill="grey">
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
            {this.state.activeEvent && (
              this.renderText()
            )}

            <text textAnchor="end" x="100%" y="35" fill="grey">
              1920
            </text>
          </g>
        </svg>
        <span className="footnote">Click a line to learn more about the date</span>
      </div>
    );
  }
};

Timeline.propTypes = {
};

export default Timeline;
