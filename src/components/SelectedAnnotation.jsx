import React from 'react';

class SelectedAnnotation extends React.Component {
  constructor(props) {
    super(props);
    this.inputText = null;
    this.onTextUpdate = this.onTextUpdate.bind(this);
  }

  render() {
    if (!this.props.annotation) return null;  //Sanity check. //TODO: Put a warning message instead, saying "No Annotations here, bro"
    
    return (
      <div className="selected-annotation">
        <h1>TODO</h1>
        <h2>Text:</h2>
        <p>
          <input type="text" ref={(c)=>{this.inputText=c}} onChange={this.onTextUpdate} value={this.props.annotation.text} />
        </p>
        <h2>Points</h2>          
        {(!this.props.annotation.points) ? null :
          this.props.annotation.points.map((point, index) => {
            return (
              <p key={`selected_annoation_point_${index}`}>x: {point.x}, y: {point.y} </p>
            );
          })
        }
      </div>
    );
  }
          
  onTextUpdate() {
    if (!this.inputText) return;
    
    //TODO
    //WARNING WARNING
    //This isn't the 'correct' way to update redux.annotations.annotations.
    //We should have a a 'save' button that calls a special function
    //ducks/annotations.updateAnnotation(selectedAnnotation, newText)
    //That updates the Redux store.
    //This little hack only works because of the way pointers work in JS.
    this.props.annotation.text = this.inputText.value;
    this.forceUpdate();  //See, by changing the values via direct pointers,
                         //sure, we change the data in the Redux store, but
                         //nobody else knows the store has been updated -
                         //not even this component!
  }
}

//TODO: propTypes, defaultProps.
 
export default SelectedAnnotation;
