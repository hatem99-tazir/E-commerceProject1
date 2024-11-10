import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import exit from "../../assets/exit.png";

const OverlayContainer = ({
  darkMode,
  className,
  stat,
  toggleOverlay,
  children,
  contentWidth,
  contentHeight,
  noExitBtn
}) => {
  return (
    <AnimatePresence>
      {stat && (
        <motion.div
          className={className + " overlay-container"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="overlay-backdrop"></div>
          <motion.div
            className={
              darkMode ? "overlay-content dark-mode" : " overlay-content"
            }
            style={{
              width: contentWidth,
              height: contentHeight,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {!noExitBtn && (
              <div
                className={
                  darkMode
                    ? "inverted-image  overlay-close-btn"
                    : "overlay-close-btn"
                }
                onClick={toggleOverlay}
              >
                <img src={exit} alt="" />
              </div>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OverlayContainer;
