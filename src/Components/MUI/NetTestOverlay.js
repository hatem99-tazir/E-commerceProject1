import React, { useState, useEffect } from "react";
import OverlayContainer from "./OverlayContainer";
import loading from "../../assets/whiteLoader.gif";

const NetTestOverlay = ({ darkMode }) => {

    
  const [isOnline, setIsOnline] = useState(navigator.onLine);




  useEffect(() => {
    // Handler to update the connection status
    const handleConnectionChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen for online and offline events
    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  // Render overlay if offline
  return (
    <OverlayContainer
      stat={!isOnline}
      contentWidth={"30vw"}
      contentHeight={"10vw"}
      noExitBtn={true}
      darkMode={darkMode}
      children={
        <div
          className={
            darkMode
              ? "dark-mode net-overlay flex-column bold align-items-center justify-center h-full"
              : "flex-column net-overlay bold align-items-center justify-center h-full"
          }
        >
          <p className="">No Internet Connection</p>
          <p className="small-text grey my-20">Checking Conexion... </p>
          <img
            alt=""
            src={loading}
            className={darkMode ? " logo-img" : " inverted-image logo-img"}
          />
        </div>
      }
    />
  );
};

export default NetTestOverlay;
