import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Grid from './components/Grid';


interface Size {
  width: number | undefined;
  height: number | undefined;
}

function App() {
  const windowSize = useWindowSize();
  const navbarHeight = 70;

  return (
    <>
      <Navbar height={navbarHeight} />
      {windowSize.height &&
        windowSize.width &&
        <Grid size={{
          width: windowSize.width,
          height: windowSize.height - navbarHeight
        }} />}
    </>
  );
}


function useWindowSize(): Size {
  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export default App;
