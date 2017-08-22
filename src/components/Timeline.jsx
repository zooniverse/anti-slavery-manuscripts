import React from 'react';
import PropTypes from 'prop-types';
import timelineEvents from '../lib/timeline-events';
import Text from './Text';

class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.timeline = null;
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.renderText = this.renderText.bind(this);

    this.state = {
      timelineText: null,
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

    const percentagePlace = (startDate - BEGINNING_YEAR) / TIMELINE_LENGTH * this.state.timelineWidth;

    return {
      placement: percentagePlace,
      width: yearWidth,
      color
    }
  }

  handleMouseEnter(e) {
    this.setState({ timelineText: e.target.getAttribute('data-index') })
  }

  handleMouseLeave() {
    this.setState({ clickIndex: null })
  }

  renderEvent(event, i) {
    const position = this.dateFinder(event.year);
    const clicked = this.state.clickIndex == i ? true : false;

    const styles = {
      exampleText: {
        width: 200
      },
      range: {
        marginLeft: 25,
        width: 275
      },
      svg: {
        height: 125,
        display: 'block',
        border: '1px solid #aaa',
        marginBottom: 10,
      }
    }

    return (
      <g key={i} className={`group-${i}`} onMouseDown={this.handleMouseEnter} >
        <line
          ref={(c) => {this.test = c;} }
          data-index={event.text}
          x1={position.placement}
          y1="50"
          x2={position.placement}
          y2="70"
          stroke={position.color}
          strokeWidth={position.width}
        />
      </g>
    )
  }

  render() {
    return (
      <div className="timeline" ref={(c)=>this.timeline=c}>
        <svg width="100%" preserveAspectRatio="xMinYMin meet" height="300" viewBox={`0 0 ${this.state.timelineWidth} 300`} xmlSpace="preserve">
          <g id="timeline">

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
            {this.state.timelineText && (
              <Text x={200} y={100} width={200}>
                {this.state.timelineText}
              </Text>
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
