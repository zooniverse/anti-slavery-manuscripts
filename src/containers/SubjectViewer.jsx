import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SVGImage from '../components/SVGImage';

class SubjectViewer extends React.Component {
  constructor(props) {
    super(props);
    
    //HTML element refs.
    this.section = undefined;
    this.svg = undefined;
    
    //Events!
    this.updateSize = this.updateSize.bind(this);
  }
  
  render() {
    const transform = `scale(${1}) translate(${0}, ${0}) rotate(${0}) `;
    
    return (
      <section className="subject-viewer" ref={(c)=>{this.section=c}}>
        <svg
          ref={(c)=>{this.svg=c}}
          viewBox="0 0 100 100"
        >
          <SVGImage src="https://panoptes-uploads.zooniverse.org/production/subject_location/97af440c-15d2-4fb1-bc18-167c9151050a.jpeg" />
        </svg>
      </section>
    );
  }
  
  componentDidMount() {
    //Make sure we monitor visible size of Subject Viewer.
    window.addEventListener('resize', this.updateSize);
    this.updateSize();
  }
  
  componentWillUnmount() {
    //Cleanup
    window.removeEventListener('resize', this.updateSize);
  }
  
  updateSize() {
    if (!this.section || !this.svg) return;
    
    const w = this.section.offsetWidth;
    const h = this.section.offsetHeight;
    
    //Note: if .offsetWidth/.offsetHeight gives problems, use
    //.getBoundingClientRect().
    
    //Use the SVG viewbox to fit the 'canvas' to the <section> container, then
    //center the view on coordinates 0, 0.
    this.svg.setAttribute('viewBox', `${-w/2} ${(-h/2)} ${w} ${h}`);
  }
}

export default SubjectViewer;