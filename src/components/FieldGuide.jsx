import React from 'react';
import PropTypes from 'prop-types';
import { StepThrough } from 'zooniverse-react-components';
import { Markdown } from "markdownz";
import { getSubjectLocation } from '../lib/get-subject-location';

class FieldGuide extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCard: null,
      groupedItems: []
    }

    this.renderItem = this.renderItem.bind(this);
    this.groupItems = this.groupItems.bind(this);
    this.renderActiveCard = this.renderActiveCard.bind(this);
    this.deactivateCard = this.deactivateCard.bind(this);
  }

  componentWillMount() {
    this.groupItems();
  }

  groupItems() {
    let groupedItems = [];

    if (this.props.guide && this.props.guide.items) {
      let size = 10;
      let items = this.props.guide.items.slice();

      while (items.length > 0)
        groupedItems.push(items.splice(0, size));
    }
    this.setState({ groupedItems })
  }

  activateCard(activeCard) {
    this.setState({ activeCard });
  }

  deactivateCard() {
    this.setState({ activeCard: null });
  }

  renderItem(items, index) {
    return (
      <div className="field-guide" key={index}>
        {items.map((item, i) => {
          const resource = item.icon;
          const src = this.props.icons[resource].src;

          return (
            <div key={i}>
              <button onClick={this.activateCard.bind(this, item)}>
                {src && (
                  <img src={src} />
                )}
                <p>{item.title}</p>
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  renderActiveCard() {
    if (!this.state.activeCard) { return null; }
    const card = this.state.activeCard;
    const src = this.props.icons[card.icon].src;

    return (
      <div className="active-card">
        <button onClick={this.deactivateCard}>
          Back
        </button>

        <div>
          {src && (
            <img src={src} />
          )}
          {card.title && (
            <h2>{card.title}</h2>
          )}

          {card.content && (
            <Markdown content={card.content} />
          )}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <p className="field-guide-title">Field Guide</p>
        {this.state.activeCard && (this.renderActiveCard())}

        {!this.state.activeCard && (
          <StepThrough>
            {this.state.groupedItems.map((items, i) => {
                return this.renderItem(items, i)
            })}
          </StepThrough>
        )}
      </div>
    )
  }
}

FieldGuide.defaultProps = {
  guide: {},
  icons: {}
};

FieldGuide.propTypes = {
  guide: PropTypes.object,
  icons: PropTypes.object,
};

export default FieldGuide;
