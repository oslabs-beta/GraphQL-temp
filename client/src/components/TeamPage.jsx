import React from 'react';
import jonathanImg from './TeamPics/Jonathan.png';
import mingzhuImg from './TeamPics/Mingzhu.png';
import ericImg from './TeamPics/Erick.png';
import brianImg from './TeamPics/Brian.png';
import danImg from './TeamPics/Dan.png';
import githubLogo from './Logos/githubLogo.png';
import linkedInLogo from './Logos/linkedin.png';

const Team = () => {
  return (
    <section className="team-section">
      <h2>Meet the team</h2>
      <div className="team-grid">
        <div className="team-member">
          <img src={jonathanImg} alt="Jonathan Ghebrial" />
          <h3>Jonathan Ghebrial</h3>
          <p>Software Engineer</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/jonathan-ghebrial/">
              <img src={linkedInLogo} alt="LinkedIn" className="social-logo" />
            </a>
            <a href="https://github.com/jonathan-github">
              <img src={githubLogo} alt="GitHub" className="social-logo" />
            </a>
          </div>
        </div>
        <div className="team-member">
          <img src={mingzhuImg} alt="Mingzhu Wan" />
          <h3>Mingzhu Wan</h3>
          <p>Software Engineer</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/mingzhuwan/">
              <img src={linkedInLogo} alt="LinkedIn" className="social-logo" />
            </a>
            <a href="https://github.com/Mingzhu666">
              <img src={githubLogo} alt="GitHub" className="social-logo" />
            </a>
          </div>
        </div>
        <div className="team-member">
          <img src={ericImg} alt="Eric Alvarez" />
          <h3>Eric Alvarez</h3>
          <p>Software Engineer</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/erick505alvarez/">
              <img src={linkedInLogo} alt="LinkedIn" className="social-logo" />
            </a>
            <a href="https://github.com/seekay505">
              <img src={githubLogo} alt="GitHub" className="social-logo" />
            </a>
          </div>
        </div>
        <div className="team-member">
          <img src={brianImg} alt="Brian Yang" />
          <h3>Brian Yang</h3>
          <p>Software Engineer</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/brian-linkedin">
              <img src={linkedInLogo} alt="LinkedIn" className="social-logo" />
            </a>
            <a href="https://github.com/jibriyang91">
              <img src={githubLogo} alt="GitHub" className="social-logo" />
            </a>
          </div>
        </div>
        <div className="team-member">
          <img src={danImg} alt="Dan Hudgens" />
          <h3>Dan Hudgens</h3>
          <p>Software Engineer</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/dan-linkedin">
              <img src={linkedInLogo} alt="LinkedIn" className="social-logo" />
            </a>
            <a href="https://github.com/DanHudgens">
              <img src={githubLogo} alt="GitHub" className="social-logo" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;