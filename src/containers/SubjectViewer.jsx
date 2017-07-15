import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SVGImage from '../components/SVGImage';
import Utility from '../lib/Utility';
import { setRotation, setScaling, setTranslation } from '../ducks/subject-viewer';

const INPUT_STATE = {
  IDLE: 0,
  ACTIVE: 1,
}

class SubjectViewer extends React.Component {
  constructor(props) {
    super(props);
    
    //HTML element refs.
    this.section = undefined;
    this.svg = undefined;
    
    //Events!
    this.updateSize = this.updateSize.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    
    //Mouse or touch pointer
    this.pointer = {
      start: { x: 0, y: 0 },
      now: { x: 0, y: 0 },
      state: INPUT_STATE.IDLE,
    };
  }
  
  //----------------------------------------------------------------
  
  render() {
    const transform = `scale(${this.props.scaling}) translate(${this.props.translationX}, ${this.props.translationY}) rotate(${this.props.rotation}) `;
    
    return (
      <section className="subject-viewer" ref={(c)=>{this.section=c}}>
        <svg
          ref={(c)=>{this.svg=c}}
          viewBox="0 0 100 100"
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
          onWheel={(e) => {
            //TODO
          }}
        >
          <g transform={transform}>
            <SVGImage src="https://panoptes-uploads.zooniverse.org/production/subject_location/97af440c-15d2-4fb1-bc18-167c9151050a.jpeg" />
          </g>
        </svg>
      </section>
    );
  }
  
  //----------------------------------------------------------------
  
  componentDidMount() {
    //Make sure we monitor visible size of Subject Viewer.
    window.addEventListener('resize', this.updateSize);
    this.updateSize();
  }
  
  componentWillUnmount() {
    //Cleanup
    window.removeEventListener('resize', this.updateSize);
  }
  
  //----------------------------------------------------------------
  
  /*  Update the size of the SVG element; this requires manual tweaking.
   */
  updateSize() {
    if (!this.section || !this.svg) return;
    
    const w = this.section.offsetWidth;
    const h = this.section.offsetHeight;
    
    //Note: if .offsetWidth/.offsetHeight gives problems, use
    //.getBoundingClientRect() or .clientHeight/.clientWidth .
    
    //Use the SVG viewbox to fit the 'canvas' to the <section> container, then
    //center the view on coordinates 0, 0.
    this.svg.setAttribute('viewBox', `${-w/2} ${(-h/2)} ${w} ${h}`);
  }
  
  //----------------------------------------------------------------
  
  onMouseDown(e) {
  }
  onMouseUp(e) {
  }
  onMouseMove(e) {
  }
  onMouseLeave(e) {
  }
  //----------------------------------------------------------------
}

SubjectViewer.propTypes = {
  rotation: PropTypes.number,
  scaling: PropTypes.number,
  translationX: PropTypes.number,
  translationY: PropTypes.number,  
};
SubjectViewer.defaultProps = {
  rotation: 0,
  scaling: 1,
  translationX: 0,
  translationY: 0,
};
function mapStateToProps(state, ownProps) {  //Listens for changes in the Redux Store
  const store = state.subjectViewer;
  return {
    rotation: store.rotation,
    scaling: store.scaling,
    translationX: store.translationX,
    translationY: store.translationY,
  };
}
export default connect(mapStateToProps)(SubjectViewer);  //Connects the Component to the Redux Store
