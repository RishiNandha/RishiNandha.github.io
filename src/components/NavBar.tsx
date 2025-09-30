// import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <nav className="navbar-content">
        <NavLink to="/" className="nav-brand">Rishi Nandha Vanchinathan</NavLink>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
          <NavLink to="/cv" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>CV</NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Research</NavLink>
        <NavLink to="/music" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Music</NavLink>
        <NavLink to="/blog" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Blog</NavLink>
      </div>
    </nav>
  </div>
  );
};

export default Navbar;