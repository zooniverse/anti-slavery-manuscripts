import React from 'react';
import { Link } from 'react-router';
import Timeline from './Timeline';
import MobileTimeline from './MobileTimeline';
import AboutEnvelope from '../images/about-envelope.png';
import AboutProgram from '../images/about-program.png';
import AboutMaria from '../images/about-maria.png';
import AboutCharles from '../images/about-charles.png';
import NotableBackground from '../images/about-three.png';
import AboutBroadside from '../images/about-broadside.png';
import Divider from '../images/img_divider.png';

class AboutTheCollection extends React.Component {
  render() {
    const timelineSize = (window.innerWidth > 700) ? <Timeline /> : <MobileTimeline />;

    return (
      <main className="app-content about-the-collection">
        <div className="project-background" />
          <div className="about-the-collection__intro flex-row">
            <div>
              <Link to="/">Anti-Slavery Manuscripts</Link>
              <h3>About <i>the</i> Collection</h3>
              <span className="about-the-collection__content">
                The Boston Public Library's Anti-Slavery collection-one of the largest
                and most important collections of abolitionists material in the United
                States-contains roughly 40,000 pieces of correspondence, broadsides,
                newspapers, pamphlets, books, and memorabilia from the 1830s through
                the 1870s.
              </span><br />
              <a href="#">View Collection</a>
            </div>
            <div>
              <img role="presentation" src={AboutEnvelope}></img>
              <span className="footnote">Envelope addressed to the Westons, CA. 1832-1867</span>
            </div>
          </div>

          <div className="about-the-collection__significance flex-row">
            <div>
              <img role="presentation" src={AboutProgram}></img>
              <span className="footnote">
                Program of anti-slavery meetings in New England, Summer of 1857
              </span>
            </div>
            <div>
              <h2 className="about-the-collection__sub-head">Significance of the Correspondence</h2>

              <div className="columns">
                <div>
                  The extensive body of correspondence records interactions among
                  leading abolitionists in the United States and Great Britain over
                  a fifty year period, thus creating an archive that comprehensively
                  documents the history of the 19-century anti-slavery movement in Boston
                  as well as abroad through the end of the American Civil War and the
                  abolition of slavery.
                </div>
                <div>
                  While the abolitionists were united in their fight against the enslavement
                  of blacks, they were not always united when it came to the question
                  of whether or not women should participate in the movement.
                </div>
                <div>
                  Women's rights also proved a dominant theme in the abolitionist movement,
                  and the deep contention surrounding this issue is reflected in the
                  correspondence. In addition, while the collection documents years of
                  concerted effort on behalf of the abolitionists to end slavery, the
                  letters also report frequently on resistance against the movement,
                  thereby providing insight into the opposition.
                </div>
              </div>

              <Link to="/classify">Start Transcribing</Link>
            </div>
          </div>

          <div className="about-the-collection__attribution">
            <span className="about-the-collection__content">
              "Through the participation of citizen historians, we now stand on the
              threshold of having available-free to all-the entire contents of the
              Boston Public Library's extraordinary Anti-Slavery Manuscripts
              collection: the personal papers of women and men who joined together,
              across barriers of race and class, in the Abolitionist crusade."
            </span>
            <img className="divider" role="presentation" src={Divider} />
            <h2>Peter Drummey</h2>
            <h3>Stephen T. Riley Librarian, Massachusetts Historical Society</h3>

          </div>

          <div className="about-the-collection__timeline">
            <h2 className="about-the-collection__sub-head">Notable Events</h2>
            {timelineSize}
          </div>

          <div className="about-the-collection__notable-figures flex-row">
            <div>
              <img src={NotableBackground} />
              <span className="footnote">
                Wendell Phillips, William Lloyd Garrison and George Thompson, 1851
              </span>
            </div>
            <div className="flex-row">
              <div>
                <figure>
                  <img role="presentation" src={AboutCharles} />
                  <span className="footnote">Charles Lenox Remond, CA. 1851-1856</span>
                </figure>
              </div>

              <div>
                <figure>
                  <img role="presentation" src={AboutMaria} />
                  <span className="footnote">Maria Weston Chapman, CA 1864</span>
                </figure>
              </div>
            </div>
            <div>
              <h2 className="about-the-collection__sub-head">Notable Figures</h2>
              <span className="about-the-collection__content">
                Letters from and to leading representatives of the abolitionist
                movement in the Boston area, most notable <i>Liberator</i> editor
                William Lloyd Garrison (1805-1879) and the Weston sisters of Weymouth,
                Massachusetts, form the most significant component of the correspondence.
              </span>
              <span className="about-the-collection__content">
                Other major holdings include the papers of American abolitionists
                Lydia Maria Child, Amos Augustus Phelps, and Samuel May Jr.; a substantial
                amount of correspondence from British and Irish abolitionists such as
                John Bishop Estlin, Harriet Martineau, and Richard and Hannah Webb,
                who did much to promote the cause both in their respective countries
                and in the United States; and records of the American, Massachusetts,
                New England, and Female Anti-Slavery Societies.
              </span>
              <a href="#">View More</a>
            </div>
          </div>

          <div className="about-the-collection__provenance flex-row">
            <div>
              <h2 className="about-the-collection__sub-head">Provenance</h2>
              <span className="about-the-collection__content">
                In the late 1890s, the family of William Lloyd Garrison, along with
                others closely involved in the anti-slavery movement, presented the
                library with a major gathering of correspondence, documents, and other
                original material relating to the abolitionist cause from 1832 until
                after the Civil War.
              </span>
              <span className="about-the-collection__content">
                The majority of the Anti-Slavery Collection was donated to the Boston
                Public Library by the end of the 19th century by Theodore Parker, Wendell
                Phillips, and the families of such abolitionists as William Lloyd
                Garrison, the Weston sisters, Amos A. Phelps, John Bishop Estlin, and Samuel Mav.
              </span>
              <a href="#">View More</a>
            </div>
            <div>
              <img role="presentation" src={AboutBroadside} />
              <span className="footnote">Broadside, 1800</span>
            </div>
          </div>

          <div className="about-the-collection__transcribe">
            <Link to="/classify">Start Transcribing</Link>
          </div>
      </main>
    );
  }
}

export default AboutTheCollection;
