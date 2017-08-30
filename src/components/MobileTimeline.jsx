import React from 'react';
import timelineEvents from '../lib/timeline-events';

class MobileTimeline extends React.Component {
  render() {
    return (
      <div className="timeline">
        {timelineEvents.map((event) => {
          return (
            <div>
              <h3>{event.year}</h3>
              <span>{event.text}</span>
            </div>
          )
        })}
      </div>
    );
  }
}

export default MobileTimeline;
