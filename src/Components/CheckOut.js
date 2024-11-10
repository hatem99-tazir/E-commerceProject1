import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { animations } from "../animations/animations";
import Form from "../Components/MUI/Form"
import "../Styles/CheckOutPage.css";

import useDarkMode from "use-dark-mode";
import Header from "./MUI/Header";

import logoImg from "../assets/sportLogo.png";

const CheckOutPage = ({ items }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleAnimationComplete = () => {
    setIsInitialLoad(false);
  };

  const darkMode = useDarkMode(false);

  const navLinks = ["Home", "Search", "Product", "About", "Contact"];
  const textColor = "black";
  const actionBtnBgColor = "#C7253E";
  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const handleNavLinkClick = (index) => {
    setSelectedNavIndex(index);
    sectionRefs[index].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleBtnActionClick = () => {
    console.log("Button action clicked");
  };

  const [selectedNavIndex, setSelectedNavIndex] = useState(0);


  const inputs = [
    {
      label: "First Name",
      type: "text",
      placeholder: "Enter Your First Name Here",
    },
    {
      label: "Last Name",
      type: "text",
      placeholder: "Enter Your Last Name Here",
    },
    {
      label: "Phone Number",
      type: "text",
      placeholder: "Enter Your Phone Number Here",
    },
    {
      label: "Address",
      type: "text",
      placeholder: "Enter Your Address Here",
    },
  ];

  return (
    <motion.div className="check-out-page">
      <motion.div
        className="check-out-page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0 }}
      >
        <Header
          logoImg={logoImg}
          logoText="Ai FaultDetector."
          navLinks={navLinks}
          actionText="Log In"
          textColor={textColor}
          actionBtnBgColor={actionBtnBgColor}
          btnAction={handleBtnActionClick}
          selectedNavIndex={selectedNavIndex}
          setSelectedNavIndex={setSelectedNavIndex}
          handleNavLinkClick={handleNavLinkClick}
          darkMode={darkMode.value}
          setDarkMode={darkMode}
        />

        <div className="check-out-page-content bold">
          <p>Check Out</p>

          <motion.div
            className="form-container"
            initial={{ right: "-100px", opacity: 0 }}
            animate={animations.commandeForm}
            transition={{ delay: isInitialLoad ? 0.9 : 0 }}
          >
            <Form
              inputs={inputs}
              actionBtnText="Order Now"
              selectedNavIndex={selectedNavIndex}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="top0 left0 product-overlay-loader bg-white full-width h-full flex align-items-center justify-center absolute"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.5 }}
      >
        <div class="spinner"></div>
      </motion.div>
    </motion.div>
  );
};

export default CheckOutPage;
