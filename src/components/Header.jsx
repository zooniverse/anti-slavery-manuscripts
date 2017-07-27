import React from 'react';
import { Link } from 'react-router';
import { ZooniverseLogo } from 'zooniverse-react-components/lib';
import AuthContainer from '../containers/AuthContainer';
import SiteNavItems from '../lib/site-nav-items';

class Header extends React.Component {
  render() {
    return (
      <header className="app-header">
        <Link to="/" className="app-title">
          <ZooniverseLogo height="1.35em" width="1.35em" />
        </Link>
        <nav>
          <ul className="app-header__nav-links flex-row">
            {SiteNavItems.map((item, i) => {
              return (
                <li key={i}>
                  <a href={item.to} className="app-header__link">{item.label}</a>
                </li>
              );
            })}
          </ul>
        </nav>
        <AuthContainer />
      </header>
    );
  }
}

export default Header;
