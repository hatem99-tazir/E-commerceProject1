export const animations = {
  preloader: {
    opacity: 0,
    scale: 0.3,
    transition: { delay: 3, ease: "easeInOut" },
  },
  app: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, delay: 3, ease: "easeInOut" },
  },
  veste: {
    right: "50%",
  },
  vesteBack: {
    right: "50%",
  },
  rotatedBackText: {
    left: "0%",
  },
  rotatedBackTextBack: {
    left: "-30%",
  },
  descContainer: {
    left: "0%",
  },
  descContainerBack: {
    left: "20%",
  },
  socialImgs: {
    bottom: "20%",
  },
  socialImgsBack: {
    bottom: "-20%",
  },
  commandeForm: {
    right: "90px",
    opacity: 1,
  },
  commandeFormBack: {
    right: "-100px",
    opacity: 0,
  },
  bottomText: {
    left: "0%",
    transition: { delay: 3.5 },
  },
  bottomTextBack: {
    left: "50%",
    transition: { delay: 3.5 },
  },
  logo: {
    position: "relative",
    top: "0",
    opacity: 1,
    transition: { delay: 3.5 },
  },
  nav: {
    position: "relative",
    left: "40px",
    opacity: 1,
    transition: { delay: 3.5 },
  },
  langueAndSignUp: {
    position: "relative",
    top: "0",
    opacity: 1,
    transition: { delay: 3.5 },
  },
  inputContainer: {
    right: "0",
    opacity: 1,
  },
  inputContainerBack: {
    right: "-100px",
    opacity: 0,
  },
  quantityContainer: {
    right: "0",
    opacity: 1,
  },
  quantityContainerBack: {
    right: "-100px",
    opacity: 0,
  },

  homeBody: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 3.5,
      },
    },
  },

  section: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        ease: "easeOut",
      },
    },
  },
};
