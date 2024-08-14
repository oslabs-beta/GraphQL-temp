import React from 'react';
import heroImg from '../../assets/logos/hero-img.png'
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaMagic, FaCogs, FaSync } from 'react-icons/fa';
import './main.scss';
// Main Component to construct 
const Main = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar/>
      <div className="container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Implementation<br /> in seconds</h1>
            <p>Automatically generate a GraphQL layer over your<br/>PostgreSQL database</p>
            <div className="main-btns-container">
              <button className="btn-login btn-home" onClick={() => navigate("/login")}>Log In</button>
              <button className="btn-signup btn-home" onClick={() => navigate("/signup")}>Sign Up</button>
            </div>
          </div>
          <div className="hero-img-container">
            <img src={heroImg} className="hero-img" alt="molecule image" />
          </div>
        </section>

        <section className="introduction">
            <div className="introduction-header">
              <h2>What is moleQLar?</h2>
              <p>moleQLar is an open-source tool that simplifies the process of overlaying a GraphQL implementation over your PostgreSQL database. Whether you're working with a monolithic or microservice architecture, moleQLar streamlines your development process.</p>
          </div>

          <div className="features">
            <h3>Key Features</h3>
            <div className="feature-grid-container">
              <div className="feature-grid">
                <div className="feature-item">
                  <FaRocket className="feature-icon" />
                  <h4>Automatic Schema Generation</h4>
                  <p>Instantly generate GraphQL schemas from your PostgreSQL database structure.</p>
                </div>
                <div className="feature-item">
                  <FaMagic className="feature-icon" />
                  <h4>Intuitive Visual Interface</h4>
                  <p>Easily modify and customize your GraphQL schema using our user-friendly interface.</p>
                </div>
                <div className="feature-item">
                  <FaCogs className="feature-icon" />
                  <h4>Customizable Resolvers</h4>
                  <p>Fine-tune your resolvers to match your specific business logic and requirements.</p>
                </div>
                <div className="feature-item">
                  <FaSync className="feature-icon" />
                  <h4>Real-time Schema Updates</h4>
                  <p>See your changes reflected in real-time as you modify your GraphQL schema.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="how-to-use">
            <h3>How to Use moleQLar</h3>
            <ol className="steps">
              <li>Sign up for an account on moleQLar.</li>
              <li>Connect your PostgreSQL database.</li>
              <li>Use our visual interface to customize your GraphQL schema.</li>
              <li>Generate and download your GraphQL schema and resolvers.</li>
              <li>Integrate the generated code into your project.</li>
            </ol>
          </div>

          <div className="cta">
            <p>Ready to simplify your GraphQL implementation?</p>
            <button className="btn-signup btn-home" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Main;