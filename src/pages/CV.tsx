import { useEffect } from 'react';

const CV = () => {
  useEffect(() => {
    // Redirect to the CV pdf file in the public folder
    window.location.href = '/CV.pdf';
  }, []);

  // Render a fallback message while redirecting
  return <p>Opening CV...</p>;
};

export default CV;