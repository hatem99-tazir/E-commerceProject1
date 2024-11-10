import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDatabase, ref, onValue } from "firebase/database"; // Import Firebase functions
import "../../Styles/UX/FlashPopUp.css";
import exit from "../../assets/exit.png";

const FlashPopUp = ({ darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // Control visibility based on flashSaleStatus
  const [flashSaleContent, setFlashSaleContent] = useState({
    flashSaleStatus: false,
    mediaType: "slider",
    mediaContent: []
  });

  // Retrieve flash sale data from the real-time database
  useEffect(() => {
    const db = getDatabase();
    const flashSaleRef = ref(db, "FlashSale"); // Assuming this is the path to the flash sale object

    // Listen for changes in the flash sale data
    onValue(flashSaleRef, (snapshot) => {
      const data = snapshot.val();

      // If the flash sale is active, set content and make the popup visible
      if (data && data.flashSaleStatus) {
        setFlashSaleContent(data);
        setIsVisible(true);
      } else {
        setIsVisible(false); // Hide the popup if flashSaleStatus is false
      }
    });
  }, []);

  // Image slider effect when mediaType is "slider"
  useEffect(() => {
    if (flashSaleContent.mediaType === "slider" && flashSaleContent.mediaContent.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashSaleContent.mediaContent.length);
      }, 5000); // Adjust the interval as needed
      return () => clearInterval(interval);
    }
  }, [flashSaleContent]);

  // Close button handler
  const closeSale = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 5 } }}
          exit={{ x: "-100%", opacity: 0 }}
          className={darkMode ? "dark-mode flash-sale-container" : "flash-sale-container"}
        >
          <div
            className={
              darkMode
                ? "inverted-image overlay-close-btn"
                : "overlay-close-btn"
            }
            onClick={closeSale}
          >
            <img src={exit} alt="Close Flash Sale" />
          </div>

          {flashSaleContent.mediaType === "slider" ? (
            <motion.img
              key={currentIndex}
              src={flashSaleContent.mediaContent[currentIndex]?.contentsLink}
              alt="Flash Sale Product Image"
              className="flash-sale-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <video
              src={flashSaleContent.mediaContent[0]?.contentsLink}
              controls
              autoPlay
              muted
              className="flash-sale-video"
            ></video>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default FlashPopUp;
