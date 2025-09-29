import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import About from './pages/About';
import Projects from './pages/Projects';
import Music from './pages/Music';
import Blog from './pages/Blog';
import FourOFour from './pages/FourOFour';
import NavBar from './components/NavBar';

const MainLayout = () => {
  const location = useLocation();
  return (
    <>
      <NavBar/>
      <main>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/music" element={<Music />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="*" element={<FourOFour />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/CV" element ={
          <Navigate to="/CV.pdf" replace />
        }
        />
        <Route path="*" element={<MainLayout />}/>
      </Routes>
    </Router>
  )
}

export default App;