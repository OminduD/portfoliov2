import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Desktop from './components/Desktop';

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!splashDone && (
          <SplashScreen key="splash" onFinish={handleSplashFinish} />
        )}
      </AnimatePresence>
      {splashDone && <Desktop />}
    </>
  );
}

export default App;
