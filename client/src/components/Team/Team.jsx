import React from 'react';
import jonathanImg from '../../assets/team-pics/Jonathan.png';
import mingzhuImg from '../../assets/team-pics/Mingzhu.png';
import ericImg from '../../assets/team-pics/Erick.png';
import brianImg from '../../assets/team-pics/Brian.png';
import danImg from '../../assets/team-pics/Dan.png';
import githubLogo from '../../assets/logos/githubLogo.png';
import linkedInLogo from '../../assets/logos/linkedin.png';

import Navbar from '../Navbar/Navbar';
import './team.scss';
// Team Page defined with JSX
const Team = () => {
  return (
    <>
      <Navbar />
      <section className='team-section'>
        <h2>Meet the Team</h2>
        <div className='team-grid'>
          <div className='team-member'>
            <img
              src={jonathanImg}
              alt='Jonathan Ghebrial'
              className='profile-img'
            />
            <h3>Jonathan Ghebrial</h3>
            <p>Software Engineer</p>
            <div className='social-links'>
              <a
                href='https://www.linkedin.com/in/jonathan-ghebrial/'
                target='_blank'
              >
                <img
                  src={linkedInLogo}
                  alt='LinkedIn'
                  className='social-logo'
                />
              </a>
              <a href='https://github.com/jonathan-github' target='_blank'>
                <img src={githubLogo} alt='GitHub' className='social-logo' />
              </a>
            </div>
          </div>
          <div className='team-member'>
            <img src={mingzhuImg} alt='Mingzhu Wan' className='profile-img' />
            <h3>Mingzhu Wan</h3>
            <p>Software Engineer</p>
            <div className='social-links'>
              <a href='https://www.linkedin.com/in/mingzhuwan/' target='_blank'>
                <img
                  src={linkedInLogo}
                  alt='LinkedIn'
                  className='social-logo'
                />
              </a>
              <a href='https://github.com/Mingzhu666' target='_blank'>
                <img src={githubLogo} alt='GitHub' className='social-logo' />
              </a>
            </div>
          </div>
          <div className='team-member'>
            <img src={ericImg} alt='Eric Alvarez' className='profile-img' />
            <h3>Erick Alvarez</h3>
            <p>Software Engineer</p>
            <div className='social-links'>
              <a
                href='https://www.linkedin.com/in/erick505alvarez/'
                target='_blank'
              >
                <img
                  src={linkedInLogo}
                  alt='LinkedIn'
                  className='social-logo'
                />
              </a>
              <a href='https://github.com/seekay505' target='_blank'>
                <img src={githubLogo} alt='GitHub' className='social-logo' />
              </a>
            </div>
          </div>
          <div className='team-member'>
            <img src={brianImg} alt='Brian Yang' className='profile-img' />
            <h3>Brian Yang</h3>
            <p>Software Engineer</p>
            <div className='social-links'>
              <a
                href='https://www.linkedin.com/in/brian-linkedin'
                target='_blank'
              >
                <img
                  src={linkedInLogo}
                  alt='LinkedIn'
                  className='social-logo'
                />
              </a>
              <a href='https://github.com/jibriyang91' target='_blank'>
                <img src={githubLogo} alt='GitHub' className='social-logo' />
              </a>
            </div>
          </div>
          <div className='team-member'>
            <img src={danImg} alt='Dan Hudgens' className='profile-img' />
            <h3>Dan Hudgens</h3>
            <p>Software Engineer</p>
            <div className='social-links'>
              <a
                href='https://www.linkedin.com/in/dan-hudgens/'
                target='_blank'
              >
                <img
                  src={linkedInLogo}
                  alt='LinkedIn'
                  className='social-logo'
                />
              </a>
              <a href='https://github.com/DanHudgens' target='_blank'>
                <img src={githubLogo} alt='GitHub' className='social-logo' />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Team;
