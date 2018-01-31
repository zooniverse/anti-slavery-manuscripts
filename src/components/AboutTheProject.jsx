import React from 'react';
import ProjectMembers from '../lib/project-members';
import Becky from '../images/Becky-Rother.jpg';
import Beth from '../images/Beth-Prindle.jpg';
import Coleman from '../images/Coleman-Krawczyk.jpg';
import Eben from '../images/Eben-English.jpg';
import Katherine from '../images/Katherine-Griffin.jpg';
import Marilyn from '../images/Marilyn-Morgan.jpg';
import Sam from '../images/Sam-Blickhan.jpg';
import Shaun from '../images/Shaun-Noordin.jpg';
import Susan from '../images/Susan-Mizruchi.jpg';
import Tom from '../images/Tom-Blake.jpg';
import Victoria from '../images/Victoria-Van-Hyning.jpg';
import Will from '../images/Will-Granger.jpg';

const members = {
  Becky,
  Beth,
  Coleman,
  Eben,
  Katherine,
  Marilyn,
  Sam,
  Shaun,
  Susan,
  Tom,
  Victoria,
  Will,
};

class AboutTheProject extends React.Component {
  renderTeamMember(member, i) {
    return (
      <div key={i} className="about-the-project__member">
        <div>
          <img role="presentation" src={members[member.photo]} />
        </div>
        <div>
          <h4>{member.name}</h4>
          <span>{member.description}</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <main className="app-content about-the-project">
        <div className="project-background" />
        <div className="about-the-project__title">
          <h2>Anti-Slavery Manuscripts</h2>
          <h3>About the Project</h3>
        </div>
        <div className="about-the-project__description">
          <span>
            The Boston Public Library&apos;s Anti-Slavery collection&mdash;one of the largest
            and most important collections of abolitionist material in the United
            States&mdash;contains roughly 40,000 pieces of correspondence, broadsides,
            newspapers, pamphlets, books, and memorabilia from the 1830s through
            the 1870s.
          </span>

          <span>
            The primary production goal of this project is to gain a complete corpus
            of machine-readable text from these handwritten documents. There are
            no software programs that can accurately convert handwriting into
            characters that a computer can understand as an actual letter, number,
            or symbol. Once the documents have all been transcribed and converted
            into this machine-readable text, we will upload the text into our
            <a
              href="https://www.digitalcommonwealth.org/collections/commonwealth:ht24xg10q"
              rel="noopener noreferrer"
              target="_blank"
            >
              repository system
            </a>
            and index them along with their corresponding image files. Users will
            then be able to search the full text of the letters across the entire collection.
          </span>

          <span>
            We also plan to make the transcriptions available as a complete, open
            access data set, with the intention that the corpus will be exposed
            to machine learning, topic modeling, and other natural language processing
            and computer visualization applications.
          </span>

          <a href="https://www.digitalcommonwealth.org/collections/commonwealth:ht24xg10q" rel="noopener noreferrer" target="_blank">View Collection</a>
        </div>

        <div className="about-the-project__team">
          <h3>The team</h3>
          {ProjectMembers.map((member, i) => {
            return this.renderTeamMember(member, i);
          })}
        </div>

        <div className="about-the-project__library-photo"></div>

        <div className="about-the-project__library">
          <h3>The Boston Public Library</h3>
          <h3>and the</h3>
          <h3>Anti-Slavery Collection of Distinction</h3>

          <span>
            In the late 1890s, the family of William Lloyd Garrison, along with
            others closely involved in the anti-slavery movement, presented
            Boston Public Library with a major gathering of correspondence,
            documents, and other original material relating to the abolitionist
            cause from 1932 until after the American Civil War.
          </span>
          <span>
            The Anti-Slavery Collection contains about 40,000 pieces of correspondence,
            broadsides, newspapers, pamphlets, books, and realia spanning a 35-year
            period. The major holdings consist of the papers of William Lloyd Garrison,
            Maria Weston Chapman and Deborah Weston, Lydia Maria Child, Amos Augustus Phelps,
            and Samuel May Jr.; records of the American, Massachusetts, New England,
            and Female Anti-Slavery Societies; and the libraries of William Lloyd Garrison,
            Theodore Parker, and Wendell Phillips.
          </span>
          <span>
            Along with the well-known and influential American abolitionists, there
            is a substantial amount of correspondence from British and Irish abolitionists
            such as John Bishop Estlin, Harriett Martineau, and Richard and Hannah Webb,
            who did much to promote the cause both in their respective countries and in
            the United States.
          </span>
          <span>
            The collection includes a full run of William Lloyd Garrison&apos;s <i>The Liberator</i>,
            a newspaper that was published continuously for 35 years, from 1831 to 1866. This
            newspaper, published by Garrison, was the official organ of the abolitionist movement.
          </span>
          <span>
            The digitization and conservation of parts of this collection has been made
            possible through the generous support of the Associates of the Boston Public
            Library and The Boston Foundation.
          </span>

          <div className="about-the-project__icons">
            <a href="https://www.facebook.com/bostonpubliclibrary/" rel="noopener noreferrer" target="_blank"><i className="fa fa-facebook fa-2x" /></a>
            <a href="https://twitter.com/BPLBoston" rel="noopener noreferrer" target="_blank"><i className="fa fa-twitter fa-2x" /></a>
            <a href="https://www.instagram.com/bplboston" rel="noopener noreferrer" target="_blank"><i className="fa fa-instagram fa-2x" /></a>
          </div>
        </div>
      </main>
    );
  }
}

export default AboutTheProject;
