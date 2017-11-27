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
      <div className="field-guide" key={`FIELD_GUIDE_PAGE_${index}`}>
        {items.map((item, i) => {
          const resource = item.icon;
          let src;

          if (this.props.icons[resource]) {
            src = this.props.icons[resource].src;
          }

          return (
            <div key={`FIELD_GUIDE_CARD_${index}-${i}`}>
              <button onClick={this.activateCard.bind(this, item)}>
                {src && (
                  <img src={src} />
                )}
                <span className="instructions">{item.title}</span>
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
    let src;

    if (this.props.icons[card.icon]) {
      src = this.props.icons[card.icon].src;
    }

    return (
      <div className="active-card">
        <button className="field-guide-title" onClick={this.deactivateCard}>
          <i className="fa fa-arrow-left" /> Back
        </button>

        <div className="active-card__content">
          <div>
            {card.title && (
              <h2>{card.title}</h2>
            )}

            {card.content && (
              <Markdown content={card.content} />
            )}
          </div>

          {src && (
            <div>
              <img src={src} />
            </div>
          )}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
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
