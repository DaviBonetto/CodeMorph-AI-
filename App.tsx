
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import DemoPage from './components/DemoPage';

const App: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);

  const handleLaunchDemo = () => {
    setShowDemo(true);
  };

  const handleGoHome = () => {
    setShowDemo(false);
  };

  return (
    <div className="min-h-screen bg-background-dark">
      {showDemo ? <DemoPage onGoHome={handleGoHome} /> : <LandingPage onLaunchDemo={handleLaunchDemo} />}
    </div>
  );
};

export default App;
