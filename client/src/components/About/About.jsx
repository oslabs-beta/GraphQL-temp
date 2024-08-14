import React from 'react';
import Navbar from '../Navbar/Navbar';
import './about.scss';
// JSX to define About page
const About = () => {
  return (
    <>
    <Navbar />
    <section className="about-section">
      <h2>We’re changing the way people think about GraphQL</h2>
      <p>
        moleQLar is a technology solution founded on the premise that interacting with databases should be intuitive, efficient, and hassle-free. We aim to empower developers by providing tools that simplify the process of creating GraphQL APIs, allowing them to focus on building amazing applications.
      </p>
      <p>
        Our mission is to streamline the process of creating GraphQL layers over PostgreSQL databases, offering a seamless experience that saves time and resources. With moleQLar, developers can generate robust and flexible GraphQL APIs in seconds, facilitating smoother data management and integration.
      </p>
      <p>
        We believe in fostering innovation and accessibility in the tech industry, and moleQLar is designed to make advanced data interaction accessible to developers of all skill levels. Join us in transforming the way we interact with data, and experience the future of GraphQL with moleQLar.
      </p>
      <div className="about-footer">
        <p>moleQLar is a software solution focused on improving developer experience with GraphQL and PostgreSQL. Join us in revolutionizing data interaction.</p>
      </div>
    </section>
    </>
  );
};

export default About;