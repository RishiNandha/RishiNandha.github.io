// import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaYoutube, FaEnvelope } from 'react-icons/fa';
// import profileGif from '../assets/profile.gif';
import headshotJpg from '../assets/headshot.jpg';
import './css/About.css';

const About = () => {
  return (
    <div className="about-container widthlimit">
      <div className="about-left">
        <h1>Hi! I'm Rishi</h1>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/rishinandhav/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://github.com/RishiNandha" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href="mailto:rishinandha.vanchi@gmail.com"><FaEnvelope /></a>
          <a href="https://www.youtube.com/@rishinandha_vanchi" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        </div>
        <p>I'm a final year student at IIT Madras (Integrated B.Tech + M.Tech) with experience in RF IC Design.</p>
        {/* { fss} */}
        <p>My research interests are analog in-memory and neuromorphic architectures. You can find some of my selected projects <Link to="/projects">here</Link>.</p>
        {/* <p>\n</p> */}
        <p>I'm also a musician and have played some original works with my friends. You can find them <Link to="/music">here</Link>.</p>
      </div>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
      <div className="about-right">
        <div className="about-right">
        <picture>
          <source srcSet={headshotJpg} type="image/jpg" />
          <img src={headshotJpg} alt="Rishi" className="profile-image" />
        </picture>
      </div>
      </div>
    </div>
  );
};
export default About;
