import React from 'react';

export default class Text extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lines: []
    }
  }

  componentWillMount() {
    const { wordsWithComputedWidth, spaceWidth } = this.calculateWordWidths();
    this.wordsWithComputedWidth = wordsWithComputedWidth;
    this.spaceWidth = spaceWidth;

    const lines = this.calculateLines(this.wordsWithComputedWidth, this.spaceWidth, this.props.width);
    this.setState({ lines });
  }

  componentDidMount() {
    const animation1 = document.getElementById('animation1');
    const animation2 = document.getElementById('animation2');
    const animation3 = document.getElementById('animation3');
    animation1.beginElement();
    animation2.beginElement();
    animation3.beginElement();
  }

  componentWillReceiveProps() {
    const animation1 = document.getElementById('animation1');
    const animation2 = document.getElementById('animation2');
    const animation3 = document.getElementById('animation3');
    animation1.beginElement();
    animation2.beginElement();
    animation3.beginElement();
  }

  render() {
    const { lineHeight, capHeight} = this.props;
    console.log(lineHeight);
    const dy = capHeight;
    const { x, y } = this.props;

    return (
      <g>
        <text textAnchor={this.props.textAnchor} id="textObj" fontSize="14" dy={`${dy}em`}>
          <tspan fontSize="16" x={x} y={y} dy="0">
            {this.props.year}
          </tspan>

          {this.state.lines.map((word, i) => (
            <tspan key={i} x={x} y={y} dy={`${i + 1 * lineHeight}em`}>
              {word}
            </tspan>
          ))}
          <animateTransform id="animation1" attributeName="transform"
            type="translate"
            values={`${this.props.x} 100`}
            dur="0s"
            begin="indefinite"
            additive="sum"
          />
          <animateTransform id="animation2" attributeName="transform"
            type="scale"
            from="0 0"
            to="1 1"
            dur="0.35s"
            begin="indefinite"
            repeatCount="1"
            additive="sum"
          />
          <animateTransform id="animation3" attributeName="transform"
            type="translate"
            values={`-${this.props.x} -100`}
            dur="0"
            begin="indefinite"
            additive="sum"
          />
        </text>
      </g>
    )
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.props.children != nextProps.children) {
      const { wordsWithComputedWidth, spaceWidth } = this.calculateWordWidths();
      this.wordsWithComputedWidth = wordsWithComputedWidth;
      this.spaceWidth = spaceWidth;
    }

    const lines = this.calculateLines(this.wordsWithComputedWidth, this.spaceWidth, this.props.width);
    const newLineAdded = this.state.lines.length !== lines.length;
    const wordMoved = this.state.lines.some((line, index) => line.length != lines[index].length);
    // Only update if number of lines or length of any lines change
    if (newLineAdded || wordMoved) {
      this.setState({ lines })
    }
  }

  calculateWordWidths() {
    // Calculate length of each word to be used to determine number of words per line
    const words = this.props.children.split(/\s+/);
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    Object.assign(text.style, this.props.style);
    svg.appendChild(text);
    document.body.appendChild(svg);

    const wordsWithComputedWidth = words.map(word => {
      text.textContent = word;
      return { word, width: text.getComputedTextLength() }
    })

    text.textContent = '\u00A0'; // Unicode space
    const spaceWidth = text.getComputedTextLength();

    document.body.removeChild(svg);

    return { wordsWithComputedWidth, spaceWidth }
  }

  calculateLines(wordsWithComputedWidth, spaceWidth, lineWidth) {
    const wordsByLines = wordsWithComputedWidth.reduce((result, { word, width}) => {
      const lastLine = result[result.length - 1] || { words: [], width: 0 };

      if (lastLine.words.length === 0) {
        // First word on line
        const newLine = { words: [word], width };
        result.push(newLine);
      } else if (lastLine.width + width + (lastLine.words.length * spaceWidth) < lineWidth) {
        // Word can be added to an existing line
        lastLine.words.push(word);
        lastLine.width += width;
      } else {
        // Word too long to fit on existing line
        const newLine = { words: [word], width };
        result.push(newLine);
      }

      return result;
    }, []);

    return wordsByLines.map(line => line.words.join(' '));
  }
}

Text.defaultProps = {
  capHeight: 0.71,
  lineHeight: 1.5,
  textAnchor: "start"
}
