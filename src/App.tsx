// import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import "./App.css";

import About from './pages/About';
import Projects from './pages/Projects';
import Music from './pages/Music';
import Blog from './pages/Blog';
import FourOFour from './pages/FourOFour';
import NavBar from './components/NavBar';
import CV from './pages/CV';

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
          <Route path="*" element={<FourOFour />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router basename="/">
      <Routes>
  {/* <Route path="/CV" element={<CV />} /> */}
  {/* <Route path="/cv" element={<CV />} /> */}
        <Route path="*" element={<MainLayout />}/>
      </Routes>
    </Router>
  )
}

export default App;