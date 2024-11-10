import React, { useState } from "react";
import { color, motion } from "framer-motion";
import { animations } from "../../animations/animations";
import Swal from "sweetalert2";

//imgs
import sun from "../../assets/sun.png";
import moon from "../../assets/moon.png";
import cart from "../../assets/cart.png";
import userIcon from "../../assets/user.png";

const Header = ({
  logoImg,
  logoText,
  navLinks,
  actionText,
  textColor,
  actionBtnBgColor,
  btnAction,
  selectedNavIndex,
  setSelectedNavIndex,
  handleNavLinkClick,
  darkMode,
  setDarkMode,
  animateCart,
  currentUser,
  logOutHandler,
  iconClickHandler,
  setToggleSideOverlay,
}) => {
  const [showCart, setShowCart] = useState(false);
  return (
    <motion.header
      className={` align- header-comp ${darkMode ? "dark-mode" : ""}`}
    >
      {logoImg ? (
        <motion.div
          initial={{ top: "-100px", opacity: 0 }}
          animate={animations.logo}
          style={{ color: darkMode ? "white" : "black" }}
        >
          <img
            src={logoImg}
            alt={"logo"}
            className={darkMode ? " inverted-image logo-img" : "logo-img"}
          />
        </motion.div>
      ) : (
        <motion.div
          className="logo"
          initial={{ top: "-100px" }}
          animate={animations.logo}
          style={{
            color: darkMode ? "white" : "black",
          }}
        >
          <p>{logoText}</p>
        </motion.div>
      )}

      <motion.nav
        initial={{ left: "-100px", opacity: 0 }}
        animate={animations.nav}
      >
        <ul>
          {navLinks.map((link, index) => (
            <motion.li
              key={index}
              className={index === selectedNavIndex ? "selected" : ""}
              onClick={() => handleNavLinkClick(index)}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              animate={
                selectedNavIndex === index
                  ? { color: "#C7253E" }
                  : { color: !darkMode ? "black" : "white" }
              }
            >
              <p>{link}</p>
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      <motion.div
        className="flex align-items-center justify-canter bold "
        initial={{ top: "-100px", opacity: 0 }}
        animate={animations.langueAndSignUp}
        style={{ color: darkMode ? "black" : "black" }}
      >
        <motion.div
          className="langue mx-20 relative"
          initial={{ borderColor: darkMode ? "red" : "black" }}
          animate={{ borderColor: darkMode ? "white" : "black" }}
          onClick={() => {
            iconClickHandler();
          }}
        >
          <motion.img
            src={cart}
            alt={"cart"}
            className={
              darkMode
                ? "langue-img cart-img inverted-image"
                : "langue-img cart-img"
            }
            initial={{ scale: 1 }}
            animate={!animateCart ? { scale: 1 } : { scale: 1.5 }}
          />

          <motion.div
            className="absolute cart-overlay"
            initial={{ opacity: 0, scale: 1 }}
            animate={
              showCart
                ? { height: "400px", opacity: 1, transformOrigin: "top" }
                : { height: "0px", opacity: 1 }
            }
          ></motion.div>
        </motion.div>

        <motion.div
          className="langue"
          initial={{ borderColor: darkMode ? "white" : "black" }}
          animate={{ borderColor: darkMode ? "white" : "black" }}
          onClick={darkMode ? setDarkMode.disable : setDarkMode.enable}
        >
          {!darkMode ? (
            <img src={moon} alt={"moon"} className="langue-img" />
          ) : (
            <img src={sun} alt={"sun"} className="langue-img" />
          )}
        </motion.div>

        <motion.div
          className={
            currentUser ? "bold logOut-Btn action-button" : "bold action-button"
          }
          initial={{
            actionBtnBgColor: "#C7253E",
            color: darkMode ? "black" : "white",
          }}
          animate={{
            backgroundColor: "#C7253E",
            color: darkMode ? "white" : "white",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={() => {
            if (currentUser) {
              var user = currentUser.name.toString();
            }
            currentUser
              ? Swal.fire({
                  title: "Log Out",
                  text: user + ", Do you want to log Out",
                  icon: "warning",
                  iconColor: "#C7253E",

                  confirmButtonText: "confirm",
                  confirmButtonColor: "#C7253E",
                  scrollbarPadding: true,
                  customClass: {
                    popup: "popup", // Add your own class for styling the entire popup
                    icon: "custom-icon-class", // Add your own class for styling the icon
                    container: "popup-container",
                  },
                }).then((res) => {
                  if (res.isConfirmed) {
                    // Handle confirm button click
                    logOutHandler(); // Replace with your logout function
                  }
                  //alert();
                  //logOutHandler()
                })
              : btnAction(2);
          }}
        >
          {currentUser ? (
            <motion.p
              className="btn"
              initial={{ opacity: 0 }}
              animate={currentUser ? { opacity: 1 } : { opacity: 0 }}
            >
              {currentUser.name} | Log Out
            </motion.p>
          ) : (
            <motion.p
              className="btn"
              initial={{ opacity: 1 }}
              animate={currentUser ? { opacity: 0 } : { opacity: 1 }}
            >
              {actionText}
            </motion.p>
          )}

          {currentUser && (
            <img
              alt=""
              src={userIcon}
              className="pointer absolute top0 user-icon web"
              onClick={(e) => {
                e.stopPropagation();
                setToggleSideOverlay(true);
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {currentUser && (
        <img
          alt=""
          src={userIcon}
          className="pointer  mobile mobile-user-icon absolute top0"
          onClick={(e) => {
            e.stopPropagation();
            setToggleSideOverlay(true);
          }}
        />
      )}
    </motion.header>
  );
};

export default Header;
