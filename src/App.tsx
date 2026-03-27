// import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router';

import "./App.css";

import About from './pages/About';
import Projects from './pages/Projects';
import Music from './pages/Music';
import Blog from './pages/Blog';
import FourOFour from './pages/FourOFour';
import NavBar from './components/NavBar';
import CV from './pages/CV';
import Activism from './pages/Activism.tsx';
import MdToBlog from './components/MdToBlog';

const MainLayout = () => {
  const location = useLocation();
  return (
    <div className="padding">
      <NavBar/>
      <main className="container">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/music" element={<Music />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/CV" element={<CV />} />
          <Route path = "/research" element={<Projects />}/>
          <Route path="*" element={<FourOFour />} />
          <Route path="/activism" element={<Activism />} />
          <Route path="/blog/:post" element={<MdToBlog />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    // <Router basename="/">
      <Routes>
        <Route path="*" element={<MainLayout />}/>
      </Routes>
    // </Router>
  )
}

export default App;