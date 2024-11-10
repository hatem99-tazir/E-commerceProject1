import "../Styles/Home.css";
import Header from "../Components/MUI/Header";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDarkMode from "use-dark-mode";
import OverlayContainer from "../Components/MUI/OverlayContainer";
import { animations } from "../animations/animations";
import Form from "../Components/MUI/Form";
import Swal from "sweetalert2";

//firebase
import { useAuth, AuthProvider } from "../Components/AuthContext";
import { ref, get } from "firebase/database";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  auth,
  database,
  GoogleAuthProvider,
  signInWithPopup,
} from "../Firebase/firebaseConfig";

//imgs
import logoImg from "../assets/sportLogo.png";
import search from "../assets/search.png";
import filter from "../assets/filter.png";

import brand1 from "../assets/brand1.png";
import brand2 from "../assets/brand2.png";
import brand3 from "../assets/brand3.png";
import brand4 from "../assets/brand4.png";
import brand5 from "../assets/brand5.png";
import arrowDown from "../assets/arrow-down.png";
import rechIcon from "../assets/search.png";
import prod1 from "../assets/prod1.png";
import prod2 from "../assets/prod2.png";
import prod3 from "../assets/prod3.png";
import prod4 from "../assets/prod4.png";
import prod5 from "../assets/prod5.png";
import prod6 from "../assets/prod6.png";
import add from "../assets/add.png";

import whiteLoader from "../assets/whiteLoader.gif";

import fb from "../assets/fb.png";
import insta from "../assets/insta.png";
import tiktok from "../assets/tiktok.png";

import blue_fb from "../assets/blue_fb.svg";
import google from "../assets/google.svg";
import userIcon from "../assets/User Male_1.svg";

import PasswordIcon from "../assets/Lock.svg";
import aboutBack from "../assets/aboutback.jpg";

import contact1 from "../assets/contact1.png";
import contact2 from "../assets/contact2.png";
import contact3 from "../assets/contact3.png";
import contact4 from "../assets/contact4.png";

import exit from "../assets/exit.png";
import CartOverlayConent from "./cartOverlayContent";
import SelectOption from "../Components/MUI/SelectOption";
import {
  getAllProducts,
  getAllTags,
  getProductById,
  getReviewsById,
  incrNumberSales,
  saveOrder,
  saveReview,
} from "../Utils/Utils";
import SignUpOverlayContent from "./SignUpOverlayContent";
import useScrollSpy from "./MUI/useScrollSpy";
import NetTestOverlay from "./MUI/NetTestOverlay";
import FlashPopUp from "./MUI/FlashPopUp";

function Home() {
  const navLinks = ["Home", "Search", "Product", "About", "Contact"];

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const darkMode = useDarkMode(false);

  const textColor = "black";
  const actionBtnBgColor = "#C7253E";

  const handleNavLinkClick = (index) => {
    setSelectedNavIndex(index);
    sectionRefs[index].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const [isPageLoad, setIsPageLoaded] = useState(true);
  const [toggleOverlay, setToggleOverlay] = useState(false);

  const [toggleProductOverlay, setToggleProductOverlay] = useState(false);
  const [toggleCartOverlay, setToggleCartOverlay] = useState(false);

  const [toggleDetailOverlay, setToggleDetailOverlay] = useState(false);

  const [toggleReviewOverlay, setToggleReviewOverlay] = useState(false);

  const [toggleCompleteInfosOverlay, setToggleCompleteInfosOverlay] =
    useState(false);

  const [toggleCreateAcountOverlay, setToggleCreateAcountOverlay] =
    useState(false);

  const [showEmailVerificationOverlay, setShowEmailVerificationOverlay] =
    useState(false);
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [address, setAddress] = useState("");

  const handleBtnActionClick = () => {
    console.log("Button action clicked");
    setToggleOverlay(!toggleOverlay);
  };

  const [selectedNavIndex, setSelectedNavIndex] = useState(0);

  const [isHovered, setIsHovered] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  /* Product Page*/
  const [hoveredProduct, setHoveredProduct] = useState(null);
  /* end Product Page*/

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false); // Loading state
  const [loginError, setLoginError] = useState(null);

  const validateForm = () => {
    if (!username) {
      setLoginError("Email is required.");
      return false;
    } else if (!password) {
      setLoginError("Password is required.");
      return false;
    }
    return true;
  };

  const { currentUser, setCurrentUser } = useAuth();
  var handleLoginClick = async () => {
    console.log("Login button clicked");
    console.log(username + " " + password);

    setLoginError(""); // Clear error message
    if (!validateForm()) {
      setLoginLoading(false); // Stop loading if validation fails
      return;
    }

    setLoginLoading(true); // Show loading icon

    setTimeout(async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          username,
          password
        );
        const user = userCredential.user;

        if (user) {
          console.log("User exists:", user);
          // Perform any post-login logic, like redirecting to a different page
          const userRef = ref(database, "users/"); // Assuming user data is stored under 'users/{uid}'
          const userSnapshot = await get(userRef);

          if (userSnapshot.exists()) {
            const usersData = userSnapshot.val();
            const foundUser = Object.values(usersData).find(
              (u) => u.uid === user.uid
            );

            if (foundUser) {
              console.log("User Data:", foundUser);

              user.name = foundUser.lastName;
              user.dataInfos = foundUser;
              user.loginSrc = "email";

              setTimeout(() => {
                setToggleOverlay(false);
              }, 1000);
              // Now you can access fields like foundUser.firstName, foundUser.lastName, etc.
              setCurrentUser(user);

              setIsPageLoaded(false);
              setTimeout(() => {
                setIsPageLoaded(true);
              }, 1000);

              setUsername("");
              setPassword("");
            } else {
              console.log("User not found in the database!");
            }
          } else {
            console.log("No user data found!");
          }
        }
      } catch (error) {
        console.error("Error logging in:", error);
        setLoginError("Invalid email or password.");
      } finally {
        setLoginLoading(false); // Hide loading icon after the login attempt
      }
    }, 2000);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setToggleOverlay(false);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        // Display success message using SweetAlert

        Swal.fire({
          icon: "success",
          title: "Sign-in successful!",
          text: `Welcome, ${user.displayName}`,
          confirmButtonColor: "#C7253E",
          iconColor: "#C7253E",
          confirmButtonText: "OK",
          customClass: {
            popup: "popup",
            icon: "custom-icon",
            container: "popup-container",
            confirmButton: "confirmButton",
          },
        });

        user.name = user.displayName.split(" ")[0];
        user.loginSrc = "google";
        console.log(user);
        setCurrentUser(user);

        setIsPageLoaded(false);
        setTimeout(() => {
          setIsPageLoaded(true);
        }, 1000);
      }
    } catch (error) {
      console.error("Error signing in: ", error);

      // Display error message using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Sign-in failed",
        text: error.message,
        confirmButtonColor: "#C7253E",
        iconColor: "#C7253E",
        confirmButtonText: "OK",
        customClass: {
          popup: "popup",
          icon: "custom-icon",
          container: "popup-container",
          confirmButton: "confirmButton",
        },
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      console.log("User signed out");

      setIsPageLoaded(false);
      setTimeout(() => {
        setIsPageLoaded(true);
      }, 0);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  /*Recomanded Product*/
  const [products, setProducts] = useState([]);

  const topProducts = [
    { id: 6, imgSrc: prod5, name: "Whey Pro ", price: "3450 DA" },
    { id: 7, imgSrc: prod2, name: "Whey Extra", price: "3400 DA" },
    { id: 8, imgSrc: prod3, name: "Protein ", price: "3400 DA" },
    { id: 9, imgSrc: prod4, name: "Product 2", price: "3990 DA" },
    { id: 10, imgSrc: prod5, name: "Carbs", price: "4800 DA" },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setIsInitialLoad(false);
  };

  /*end Recomanded Product*/

  /*Commande Form*/
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1,
  });
  const [formErrors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation function
  const validateCommandeForm = () => {
    let formErrors = {};
    if (!formValues.name) formErrors.name = "Name is required";
    if (!formValues.phone) formErrors.email = "Phone is required";
    if (!formValues.address) formErrors.address = "Address is required";
    return formErrors;
  };

  // Handle form input change
  const handleChange = (e, name) => {
    console.log("changing");
    const value = e.target.value;
    console.log(name);
    setFormValues({ ...formValues, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    console.log("submit clicked");
    console.log(formValues);
    console.log(selectedProduct.id);

    e.preventDefault();
    const formErrors = validateCommandeForm();
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);

      console.log(selectedProduct);
      console.log(parseFloat(selectedProduct.price));

      var order = {
        clientId: null,
        clientName: formValues.name,
        clientPhone: formValues.phone,
        address: formValues.address,
        wilaya: "Alger",

        products: [
          { productId: selectedProduct.id, quantity: formValues.quantity },
        ],
        total: Number(selectedProduct.price) * Number(formValues.quantity),
        date: new Date().toISOString().split("T")[0],
        orderStatus: false,
        paymentStatus: false,
      };

      console.log(order);

      saveOrder(order).then(() => {
        incrNumberSales(selectedProduct.id);
        // Simulate form submission
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Order placed successfully!",
            html: `<p class="popup-custom-text small-text grey bold">Your order for ${selectedProduct.name} has been placed.</p>`,

            confirmButtonColor: "#C7253E",
            iconColor: "#C7253E",
            confirmButtonText: "Done",
            customClass: {
              popup: "popup", // Add your own class for styling the entire popup
              icon: "custom-icon", // Add your own class for styling the icon
              container: "popup-container",
              confirmButton: "confirmButton",
              validationMessage: "validationMessage",
              title: "popup-custom-title",
              image: "custom-image",
            },
          });
          setIsSubmitting(false);
          setToggleProductOverlay(false); // Close overlay after success
          setToggleDetailOverlay(false);
        }, 500);
      });
    } else {
      setErrors(formErrors);
    }
  };

  const validateCompleteForm = () => {
    const errors = {};
    if (!phone) errors.phone = "Phone number is required";
    if (!wilaya) errors.wilaya = "Wilaya is required";
    if (!address) errors.address = "Address is required";

    return errors;
  };

  const completeFormHandler = () => {
    const validationErrors = validateCompleteForm();

    if (Object.keys(validationErrors).length > 0) {
      console.log(validationErrors);
      setErrors(validationErrors); // Set errors if validation fails
    } else {
      setErrors({});
      // Handle successful form submission here, e.g., save to database or call an API

      submitCartForm();
      console.log("Form submitted successfully:", { phone, wilaya, address });
    }
  };
  const submitCartForm = () => {
    if (currentUser) {
      console.log(initialCartItems);

      var products = [];
      var tot = 0;

      for (let index = 0; index < initialCartItems.length; index++) {
        const element = initialCartItems[index];
        incrNumberSales(element.id);
        products.push({ productId: element.id, quantity: element.quantity });
        tot = tot + parseInt(element.unitPrice) * parseInt(element.quantity);
      }

      console.log(products);
      console.log(currentUser);

      var order = {
        clientId: currentUser.uid,
        clientName: currentUser.name,
        clientPhone: phone,
        address: address,
        wilaya: wilaya,
        products: products,
        total: tot,
        date: new Date().toISOString().split("T")[0],
        orderStatus: false,
        paymentStatus: false,
      };

      console.log(order);
      saveOrder(order).then((ref) => {
        console.log("ref saved : " + ref);

        setTimeout(() => {
          setCommandeClickLoading(false);
          setToggleCartOverlay(false);
          setToggleOverlay(false);
          setToggleCompleteInfosOverlay(false);
          setInitialCartItems([]);
          setPhone("");
          setWilaya("");
          setAddress("");
          Swal.fire({
            icon: "success",
            title: "Order placed successfully!",
            html: `<p class="popup-custom-text small-text grey bold">Your order has been placed.</p>`,
            confirmButtonColor: "#C7253E",
            iconColor: "#C7253E",
            confirmButtonText: "Done",
            customClass: {
              popup: "popup",
              icon: "custom-icon",
              container: "popup-container",
              confirmButton: "confirmButton",
              validationMessage: "validationMessage",
              title: "popup-custom-title",
              image: "custom-image",
            },
          });
        }, 2000);
      });
    } else {
      setToggleOverlay(true);
    }
  };

  const inputs = [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter Your Name Here",
      value: formValues.name,
      onChange: (e) => handleChange(e, "name"),
    },
    {
      label: "Phone",
      name: "phone",
      type: "text",
      placeholder: "Enter Your phone Here",
      value: formValues.phone,
      onChange: (e) => handleChange(e, "phone"),
    },
    {
      label: "Address",
      name: "address",
      type: "text",
      placeholder: "Enter Your Address Here",
      value: formValues.address,
      onChange: (e) => handleChange(e, "address"),
    },
    {
      label: "Quantity",
      name: "quantity",
      type: "text",
      placeholder: "Enter Your Quantity Here",
      value: formValues.quantity,
      onChange: (e) => handleChange(e, "quantity"),
    },
  ];

  /*end Commande Form*/

  /*Search page*/

  const [allProducts, setAllProduct] = useState([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // State for the search query
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedBrand, setSelectedBrand] = useState(""); // Default no brand selected
  const [selectedTags, setSelectedTags] = useState([]); // Array of selected tags

  const [allTags, setAllTags] = useState([]);
  const [allBrands, setAllBrands] = useState([]);

  const [reviews, setReviews] = useState([
    { client: "Hatem.TM", review: "awsome Product!" },
  ]);

  const [reviewVal, setReviwVal] = useState("");

  const [reviewClickLoading, setReviewClickLoading] = useState(false);

  // Handle tag selection
  const toggleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag)); // Deselect tag
    } else {
      setSelectedTags([...selectedTags, tag]); // Select tag
    }
  };

  // Filter based on both brand and tags
  const filteredProducts = allProducts.filter((product) => {
    const productPrice = Number(product.price); // Convert the product price string to a number

    // Only filter by price if minPrice or maxPrice are not empty
    const withinPriceRange =
      (minPrice === "" && maxPrice === "") || // If both are empty, skip price filtering
      (minPrice !== "" &&
        maxPrice === "" &&
        productPrice >= Number(minPrice)) || // Only minPrice is provided
      (minPrice === "" &&
        maxPrice !== "" &&
        productPrice <= Number(maxPrice)) || // Only maxPrice is provided
      (minPrice !== "" &&
        maxPrice !== "" &&
        productPrice >= Number(minPrice) &&
        productPrice <= Number(maxPrice)); // Both minPrice and maxPrice are provided

    // Check if the selected brand is "All brands" or matches the product's brand
    const matchesBrand =
      selectedBrand === "All Brands" || product.brand === selectedBrand;

    // Check if the selected tags match the product's tags
    const matchesTags = selectedTags.length
      ? selectedTags.every((tag) => product.tags.includes(tag))
      : true;

    // Check if the search query matches the product name
    const matchesSearchQuery = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Return true only if all conditions are satisfied
    return (
      withinPriceRange && matchesBrand && matchesTags && matchesSearchQuery
    );
  });

  /*end Search page*/

  /* cart overlay*/
  const [commandeClickLoading, setCommandeClickLoading] = useState(false);

  const [initialCartItems, setInitialCartItems] = useState([]);

  const addToCart = (product) => {
    // Check if the product already exists in the cart
    const existingProduct = initialCartItems.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      // If product exists, update the quantity
      const updatedCartItems = initialCartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 } // Increment the quantity
          : item
      );
      setInitialCartItems(updatedCartItems);
    } else {
      // If product doesn't exist, add it to the cart with quantity 1
      const newProduct = {
        id: product.id,
        name: product.name,
        description: product.description || "", // If the product description isn't provided
        unitPrice: parseInt(product.price), // Convert price to number, remove DA
        quantity: 1,
        image: product.imgSrc[0],
      };
      setInitialCartItems([...initialCartItems, newProduct]);
    }
  };

  const removeFromCart = (productId) => {
    // Filter out the product with the given id
    const updatedCartItems = initialCartItems.filter(
      (item) => item.id !== productId
    );

    // Update the state with the new cart items
    setInitialCartItems(updatedCartItems);
  };

  /*end cart overlay */

  /*prod details*/
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { id: 1, src: prod4, alt: "Whey Protein 1" },
    { id: 2, src: prod2, alt: "Whey Protein 2" },
    { id: 3, src: prod3, alt: "Whey Protein 3" },
  ];

  useScrollSpy(sectionRefs, setSelectedNavIndex);

  useEffect(() => {
    getAllProducts().then((res) => {
      console.log(res);

      if (res) {
        var productList = [];
        var brands = ["All Brands"];
        for (let index = 0; index < res.length; index++) {
          const element = res[index];

          var pr = {
            id: element.id,
            imgSrc: element.imagesUrls,
            name: element.productName,
            price: element.price,
            brand: element.brandName,
            tags: element.tags,
            reviews: [
              { name: "hatem", rating: 5, comment: "Best product ever" },
            ],
            numberSelles: element.numberSelles,
          };

          productList.push(pr);

          if (!brands.includes(pr.brand)) {
            brands.push(pr.brand);
          }

          setAllProduct(productList);
          setProducts(productList);
          setAllBrands(brands);
          console.log(pr);
        }
      }
    });

    getAllTags().then((res) => {
      console.log(res);
      setAllTags(res);
    });

    /*
    var order = {client : {clientId : null , clientName: "hatem" , clientPhone:"0552990625" ,clientEmail:"hatem6718@gmail.com" , address:"Centre ville" , wilaya:"Alger"}, products:[{productId:1 , quantity : 2 } , {productId:2 , quantity : 2 }] , total : 2000 , date : "24/10/2024"};
    saveOrder(order).then((res)=> {
      console.log(res);
    })

    */
    const interval = setInterval(() => {
      if (selectedProduct) {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === selectedProduct.imgSrc.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 4000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [selectedProduct]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(currentUser);
      if (currentUser) {
        // Perform any post-login logic, like redirecting to a different page
        const userRef = ref(database, "users/"); // Assuming user data is stored under 'users/{uid}'
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          const usersData = userSnapshot.val();
          const foundUser = Object.values(usersData).find(
            (u) => u.uid === currentUser.uid
          );

          if (foundUser) {
            console.log("User Data:", foundUser);

            currentUser.name = foundUser.lastName;
            currentUser.dataInfos = foundUser;
            currentUser.loginSrc = "email";

            setCurrentUser(currentUser);
            console.log(currentUser);
            console.log("User is logged in:", currentUser);
          } else {
            console.log("User not found in the database!");
          }
        } else {
          console.log("No user data found!");
        }
      } else {
        setCurrentUser(null);
        console.log("No user is logged in");
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  /*end prod details*/

  /*Side Overlay*/

  const [toggleSideOverlay, setToggleSideOverlay] = useState(false);

  const [toggleFilterSideOverlay, setToggleFilterSideOverlay] = useState(false);

  //Flash Pop Up
  const flashSaleContent = {
    type: "slider",
    items: [prod2, prod3, prod4],
  };
  //end Flash
  return isPageLoad ? (
    <div className={`App ${darkMode.value ? "dark-mode" : "light-mode"}`}>
      <motion.div
        className={
          darkMode.value
            ? "dark-mode  loader-container absolute w-full h-full  flex align-items-center justify-center"
            : "light-mode  loader-container absolute w-full h-full  flex align-items-center justify-center"
        }
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0, transition: { delay: 3 } }}
      >
        <div className="spinner"></div>
      </motion.div>
      <motion.div
        className="content"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 3.2 } }}
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
          animateCart={animateCart}
          currentUser={currentUser}
          logOutHandler={handleLogout}
          iconClickHandler={() => setToggleCartOverlay(true)}
          setToggleSideOverlay={setToggleSideOverlay}
        />

        <div
          className="section section1 home-section flex align-items-start"
          ref={sectionRefs[0]}
        >
          <div className="section-content bold">
            <div className="flex justify-space-between align-items-center rech-div">
              <div className="input-container">
                <input
                  placeholder="Search..."
                  onClick={() => {
                    handleNavLinkClick(2);
                  }}
                />
                <img
                  src={rechIcon}
                  alt=""
                  className="absolute right0 small-icon"
                />
              </div>
            </div>
            <div className="flex justify-space-between align-items-center main-text-container">
              <p>Sport Project E-commerce Web Site</p>
            </div>

            <motion.div
              className="home-imgs-galery flex justify-center align-center absolute"
              animate={
                window.innerWidth <= 468
                  ? {
                      x: ["0%", "-70%", "0%"],
                      transition: {
                        x: {
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 9,
                          delay: 4.5,
                        },
                      },
                    }
                  : {
                      x: ["0%", "-10%", "10%"],
                      transition: {
                        x: {
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 5,
                          delay: 4.5,
                        },
                      },
                    }
              }
            >
              <div className="home-img flex align-items-center  border-radius ">
                <img src={prod1} alt="" />
              </div>
              <div className="home-img flex align-items-center justify-center border-radius ">
                <img src={prod2} alt="" />
              </div>
              <div className="home-img flex align-items-center justify-center border-radius ">
                <img src={prod3} alt="" />
              </div>
              <div className="home-img flex align-items-center justify-center border-radius ">
                <img src={prod4} alt="" />
              </div>
              <div className="home-img flex align-items-center justify-center border-radius ">
                <img src={prod5} alt="" />
              </div>
              <div className="home-img flex align-items-center justify-center border-radius ">
                <img src={prod6} alt="" />
              </div>
              <div className="home-img flex align-items-center justify-center border-radius ">
                <img src={prod1} alt="" />
              </div>
            </motion.div>

            <div className="home-end flex-column justify-space-evenly align-items-center absolute  full-width bottom0 left0">
              <motion.div
                className="full-width  relative home-end-content1"
                initial={{ opacity: 0, left: "100px" }}
                animate={{
                  opacity: 1,
                  left: "0px",
                  transition: { delay: 3.5 },
                }}
              >
                <div className="flex-column full-width">
                  <p>
                    More Then <span className="red">10K</span> Products
                  </p>
                  <p className="small-text grey">More then 58 Brand</p>
                </div>

                <div className="flex brands-imgs full-width">
                  <img
                    src={brand1}
                    alt=""
                    className={
                      darkMode.value
                        ? "inverted-image logo-img pointer "
                        : "logo-img pointer "
                    }
                  />
                  <img
                    src={brand2}
                    alt=""
                    className={
                      darkMode.value
                        ? "inverted-image logo-img pointer "
                        : "logo-img pointer "
                    }
                  />
                  <img src={brand3} alt="" className="logo-img pointer" />
                  <img
                    src={brand4}
                    alt=""
                    className={
                      darkMode.value
                        ? "inverted-image logo-img pointer "
                        : "logo-img pointer "
                    }
                  />
                  <img
                    src={brand5}
                    alt=""
                    className={
                      darkMode.value
                        ? "inverted-image logo-img pointer "
                        : "logo-img pointer "
                    }
                  />
                </div>

                <div className=" absolute top0 right0 left-infos flex-column align-items-end">
                  <p>
                    More Then <span className="red">658</span> Clients
                  </p>

                  <p className="small-text grey">More then 2658 reviews</p>
                  <motion.div
                    className="action-button  bottom0 right0"
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
                      handleNavLinkClick(3);
                    }}
                  >
                    <p className="btn">See Reviews</p>
                  </motion.div>
                </div>
              </motion.div>

              <div className="arrowdown full-width align-items-center justify-center bottom-action">
                <motion.img
                  src={arrowDown}
                  alt=""
                  className="logo-img pointer"
                  onClick={() => handleNavLinkClick(1)}
                  initial={{ bottom: "-100px", opacity: 0 }}
                  animate={{
                    bottom: "25px",
                    opacity: 1,
                    transition: { delay: 4 },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="section section2 home-section flex-column align-items-start products-page bold"
          ref={sectionRefs[1]}
        >
          <div
            className={
              darkMode.value
                ? "dark-mode absolute back-text"
                : " absolute back-text"
            }
          >
            <p className="">Sport Materials</p>
          </div>
          <div className="flex justify-space-between align-items-center main-text-container">
            <p>Recomanded Products</p>
          </div>
          <div className="home-imgs-galery flex justify-center align-center my-20">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="home-img flex-column align-items-center justify-center border-radius relative"
                animate={hoveredProduct === product.id ? { width: "49vh" } : {}}
                onClick={() => {
                  window.innerWidth <= 468 && setHoveredProduct(product.id);
                }}
                onMouseEnter={() =>
                  !(window.innerWidth <= 468) && setHoveredProduct(product.id)
                }
                onMouseLeave={() =>
                  !window.innerWidth <= 468 && setHoveredProduct(null)
                }
              >
                {/* Product Image and Basic Info */}
                <div className="full-width card-content flex-column justify-center align-items-center">
                  <img src={product.imgSrc[0]} alt={product.name} />
                  <p>{product.name}</p>
                  <p className="red my-5">{product.price}</p>
                </div>

                {/* Hidden Detail Section */}
                <motion.div
                  className="absolute full-height top0 right0 flex-column align-items-center justify-center card-hidden-info"
                  initial={{ opacity: 0, right: "-100px" }}
                  animate={
                    hoveredProduct === product.id
                      ? {
                          opacity: 1,
                          right: "0px",
                          transition: { delay: 0.1 },
                        }
                      : { opacity: 0, right: "-100px" }
                  }
                >
                  <p className="small-text grey">{product.brand}</p>
                  <p>{product.name}</p>

                  {/* Action Buttons */}
                  <div className="flex align-items-center">
                    <motion.div
                      className="action-button my-10 mx-5"
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
                        setToggleProductOverlay(true);
                        handleBuyClick(product);
                      }}
                    >
                      <p className="btn">Acheter</p>
                    </motion.div>

                    <motion.div
                      className="action-button mx-5"
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
                        getReviewsById(product.id).then((res) => {
                          console.log(res);
                          var revs = [];
                          for (let index = 0; index < res.length; index++) {
                            const element = res[index];
                            revs.push({
                              client: element.reviewerName,
                              review: element.reviewText,
                              date: element.createdAt,
                              status: element.status,
                            });
                          }
                          setReviews(revs);
                          setToggleDetailOverlay(true);
                          handleBuyClick(product);
                        });
                      }}
                    >
                      <p className="btn">Infos</p>
                    </motion.div>
                  </div>
                  <img
                    className="small-icon mx-10 pointer"
                    src={add}
                    alt="Add to cart"
                    onClick={() => {
                      setAnimateCart(true);
                      setTimeout(() => setAnimateCart(false), 200);
                      addToCart(product);
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
          <div className="scroll-index">
            <div className="index selected-index"></div>
            <div className="index"></div>
            <div className="index"></div>
          </div>
          <div className="flex justify-space-between align-items-center main-text-container">
            <p>Top Selled Products</p>
          </div>

          <div className="home-imgs-galery flex justify-center align-center my-20  top-gallry">
            {products.map((product) => (
              <motion.div
                key={product.id + "100"}
                className="home-img flex-column align-items-center justify-center border-radius relative"
                animate={
                  hoveredProduct === product.id + "100" ? { width: "49vh" } : {}
                }
                onClick={() => {
                  window.innerWidth <= 468 &&
                    setHoveredProduct(product.id + "100");
                }}
                onMouseEnter={() =>
                  !(window.innerWidth <= 468) &&
                  setHoveredProduct(product.id + "100")
                }
                onMouseLeave={() =>
                  !window.innerWidth <= 468 && setHoveredProduct(null)
                }
              >
                {/* Product Image and Basic Info */}
                <div className="full-width card-content flex-column justify-center align-items-center">
                  <img src={product.imgSrc[0]} alt={product.name} />
                  <p>{product.name}</p>
                  <p className="red my-5">{product.price}</p>
                </div>

                {/* Hidden Detail Section */}
                <motion.div
                  className="absolute full-height top0 right0 flex-column align-items-center justify-center card-hidden-info"
                  initial={{ opacity: 0, right: "-100px" }}
                  animate={
                    hoveredProduct === product.id + "100"
                      ? {
                          opacity: 1,
                          right: "0px",
                          transition: { delay: 0.1 },
                        }
                      : { opacity: 0, right: "-100px" }
                  }
                >
                  <p className="small-text grey">{product.brand}</p>
                  <p>{product.name}</p>

                  {/* Action Buttons */}
                  <div className="flex align-items-center">
                    <motion.div
                      className="action-button my-10 mx-5"
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
                        setToggleProductOverlay(true);
                        handleBuyClick(product);
                      }}
                    >
                      <p className="btn">Acheter</p>
                    </motion.div>

                    <motion.div
                      className="action-button mx-5"
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
                        setToggleDetailOverlay(true);
                        handleBuyClick(product);
                      }}
                    >
                      <p className="btn">Infos</p>
                    </motion.div>
                  </div>
                  <img
                    className="small-icon mx-10 pointer"
                    src={add}
                    alt="Add to cart"
                    onClick={() => {
                      setAnimateCart(true);
                      setTimeout(() => setAnimateCart(false), 200);
                      addToCart(product);
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}{" "}
          </div>

          <div className="scroll-index">
            <div className="index selected-index"></div>
            <div className="index"></div>
            <div className="index"></div>
          </div>
        </div>

        <div
          className="section section3 products-section flex align-items-start bold"
          ref={sectionRefs[2]}
        >
          <motion.div className="filters-container bold absolute h-full top0 left0">
            <p>Filter</p>
            <div className="filter-container">
              <p className="grey small-text ">Brand</p>
              <div className="filter-options">
                <SelectOption
                  options={allBrands}
                  onOptionSelect={setSelectedBrand}
                />
              </div>
            </div>

            <div className="filter-container">
              <p className="grey small-text my-10">Tags</p>
              <div className="filter-options grid-filter-options">
                {allTags.map((tag, index) => {
                  return (
                    <motion.div
                      className="filter tag"
                      initial={
                        darkMode.value
                          ? { backgroundColor: "#595252", color: "#9babb8" }
                          : { backgroundColor: "#fff", color: "#9babb8" }
                      }
                      animate={
                        selectedTags.includes(tag)
                          ? { backgroundColor: "#c7253e", color: "white" }
                          : !darkMode.value
                          ? { backgroundColor: "white", color: "#9babb8" }
                          : { backgroundColor: "transparent", color: "#9babb8" }
                      }
                      onClick={() => toggleTagSelection(tag)}
                    >
                      <p>{tag}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="filter-container">
              <p className="grey small-text my-10">Price</p>
              <div className="filter-options">
                <input
                  type="text"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Max Price"
                  className="my-10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          <div className="flex justify-space-between align-items-center rech-div">
            <div className="input-container">
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <img
                src={rechIcon}
                alt=""
                className="absolute right0 small-icon"
                // Update searchQuery when input changes
              />
            </div>
            <img
              src={filter}
              alt=""
              className={
                darkMode.value
                  ? " inverted-image logo-img pointer filter-img"
                  : "logo-img pointer filter-img"
              }
              onClick={() => {
                setToggleFilterSideOverlay(true);
              }}
            />
          </div>

          <div className="products-grid">
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <motion.div>
                  <motion.div
                    className="relative"
                    key={`${product.id}-${searchQuery}`} // Dynamic key to trigger animation on search
                    initial={{ opacity: 0, y: 20 }} // Start with 0 opacity and slight y translation
                    animate={{ opacity: 1, y: 0 }} // Animate to full opacity and y=0
                    exit={{ opacity: 0, y: 20 }} // Exit with same transition when removed
                    // Short animation duration
                  >
                    <motion.div
                      className="home-img flex-column align-items-center justify-center border-radius"
                      onClick={() => {
                        setSelectedProduct(product);
                        getReviewsById(product.id).then((res) => {
                          console.log(res);
                          var revs = [];
                          for (let index = 0; index < res.length; index++) {
                            const element = res[index];
                            revs.push({
                              client: element.reviewerName,
                              review: element.reviewText,
                              date: element.createdAt,
                              status: element.status,
                            });
                          }
                          setReviews(revs);

                          setTimeout(() => {
                            setToggleDetailOverlay(true);
                          }, 500);
                        });
                      }}
                    >
                      {/* Animate the image */}
                      <motion.img
                        src={product.imgSrc[0]}
                        alt={product.name}
                        initial={{ opacity: 0, y: 20 }} // Start slightly below and invisible
                        animate={{ opacity: 1, y: 0 }} // Fade in and move up
                        transition={{ delay: 0.5 + index * 0.05 }} // Delay based on the product index
                        style={{ zIndex: 1 }}
                      />
                      {/* Animate the product name */}

                      <motion.p
                        className="small-text grey my-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }} // Delay even more
                      >
                        {product.brand}
                      </motion.p>
                      <motion.p
                        className="grey back-text absolute"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 0.3, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ zIndex: 0 }} // Delay even more
                      >
                        {selectedTags && selectedTags.length > 0
                          ? selectedTags[0]
                          : product.tags && product.tags.length > 0
                          ? product.tags[0]
                          : "No Tags"}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }} // Delay slightly more than image
                        style={{ zIndex: 1 }}
                      >
                        {product.name}
                      </motion.p>
                      {/* Animate the product price */}

                      <motion.p
                        className="red my-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ zIndex: 1 }}
                        transition={{ delay: index * 0.05 }} // Delay even more
                      >
                        {product.price + " DA"}
                      </motion.p>

                      {/*
                        <img
                        className="small-icon mx-10 pointer"
                        src={add}
                        alt="Add to cart"
                        onClick={() => {
                          setAnimateCart(true);
                          setTimeout(() => setAnimateCart(false), 200);
                          addToCart(product);
                      }}
                    />
                      */}
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))
            ) : (
              <p>No products found</p>
            )}

            <motion.div
              className="action-button absolute pointer"
              initial={{
                actionBtnBgColor: "#C7253E",
                color: darkMode ? "black" : "white",
              }}
              animate={{
                backgroundColor: "#C7253E",
                color: darkMode ? "white" : "white",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <p className="btn">+ Load More</p>
            </motion.div>
          </div>
        </div>

        <div
          className="section section4 home-section about-section flex align-items-start"
          ref={sectionRefs[3]}
        >
          <div className="white bold black-overlay h-full w-full absolute flex-column align-items-center justify-center">
            <p className="main-text">
              Know More <span>About Us !</span>
            </p>
            <p className="small-text my-20">
              Welcome to [Website Name], your trusted destination for premium
              sports equipment and gear. Whether you're a professional athlete,
              a fitness enthusiast, or someone just starting their journey, we
              offer a wide range of high-quality products to help you perform at
              your best. From top-of-the-line apparel and footwear to
              specialized gear for every sport, our collection is carefully
              curated to meet the demands of athletes of all levels. At [Website
              Name], we're passionate about empowering you to achieve your goals
              by providing the right tools and expert advice to enhance your
              performance and elevate your game.
            </p>

            <div className="about-items flex justify-center align-items-center my-20 f-width ">
              <div className="about-item ">
                <p className="main-text">5</p>
                <div className="fit-content-hr"></div>
                <p className="small-text my-10">Years Of Experience</p>
              </div>

              <div className="about-item ">
                <p className="main-text">5</p>
                <div className="fit-content-hr"></div>
                <p className="small-text my-10">Years Of Experience</p>
              </div>

              <div className="about-item ">
                <p className="main-text">5</p>
                <div className="fit-content-hr"></div>
                <p className="small-text my-10">Years Of Experience</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="dark- section section5 bold home-section flex-column align-items-center justify-center"
          ref={sectionRefs[4]}
        >
          <img
            alt=""
            src={logoImg}
            className={darkMode.value ? "inverted-image logo-img" : "logo-img"}
          />
          <p className="sec-text">Contact Our Freindly Team!</p>
          <p className="small-text grey ">
            You Will Find Out All What You Need To Get Support In This Section
          </p>

          <div className="flex my-40 contact-divs">
            <div className="flex-column justify-space-between mx-20 p-10 contact-div border-radius-5">
              <div className="">
                <img
                  alt=""
                  src={contact1}
                  className={
                    darkMode.value ? "inverted-image logo-img" : "logo-img"
                  }
                />
              </div>
              <div>
                <p className=" my-5">Chat To Support</p>
                <p className="small-text grey">
                  Contact Us If You Need Any Support Informations
                </p>
                <div className="full-width-hr"></div>
                <p className="small-text underline">emailSupport@Gmail.com</p>
              </div>
            </div>

            <div className="flex-column justify-space-between mx-20 p-10 contact-div border-radius-5">
              <div className="">
                <img
                  alt=""
                  src={contact2}
                  className={
                    darkMode.value ? "inverted-image logo-img" : "logo-img"
                  }
                />
              </div>
              <div>
                <p className=" my-5">Chat To Support</p>
                <p className="small-text grey ">
                  Contact Us If You Need Any Support Informations
                </p>
                <div className="full-width-hr"></div>
                <p className="small-text underline">emailSupport@Gmail.com</p>
              </div>
            </div>

            <div className="flex-column justify-space-between mx-20 p-10 contact-div border-radius-5">
              <div className="">
                <img
                  alt=""
                  src={contact3}
                  className={
                    darkMode.value ? "inverted-image logo-img" : "logo-img"
                  }
                />
              </div>
              <div>
                <p className=" my-5">Chat To Support</p>
                <p className="small-text grey ">
                  Contact Us If You Need Any Support Informations
                </p>
                <div className="full-width-hr"></div>
                <p className="small-text underline">emailSupport@Gmail.com</p>
              </div>
            </div>

            <div className="flex-column justify-space-between mx-20 p-10 contact-div border-radius-5">
              <div className="">
                <img
                  alt=""
                  src={contact4}
                  className={
                    darkMode.value ? "inverted-image logo-img" : "logo-img"
                  }
                />
              </div>
              <div>
                <p className=" my-5">Chat To Support</p>
                <p className="small-text grey ">
                  Contact Us If You Need Any Support Informations
                </p>
                <div className="full-width-hr"></div>
                <p className="small-text underline">emailSupport@Gmail.com</p>
              </div>
            </div>
          </div>

          <div className="flex-column w-full contact-end">
            <div className="flex align-items-center">
              <img
                alt=""
                src={logoImg}
                className={
                  darkMode.value ? "inverted-image logo-img" : "logo-img"
                }
              />
              <p className="mx-20">Sport Mat.</p>
            </div>

            <p className="small-text grey my-20 w-50">
              You Will Find Out All What You Need To Get Support In This
              Section, You Will Find Out All What You Need To Get Support In
              This Section.
            </p>
            <div className="flex w-full justify-space-between align-items-center">
              <p className="small-text">
                @ SportMat. All CopyRights Are Protected
              </p>
              <div className="flex">
                <img
                  alt=""
                  src={fb}
                  className={
                    darkMode.value
                      ? "logo-img mx-10"
                      : "inverted-image logo-img mx-10"
                  }
                />
                <img
                  alt=""
                  src={insta}
                  className={
                    darkMode.value
                      ? "logo-img mx-10"
                      : "inverted-image logo-img mx-10"
                  }
                />
                <img
                  alt=""
                  src={tiktok}
                  className={
                    darkMode.value
                      ? "logo-img mx-10"
                      : "inverted-image logo-img mx-10"
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <OverlayContainer
          contentHeight="90%"
          contentWidth="40%"
          darkMode={darkMode.value}
          toggleOverlay={() => setToggleDetailOverlay(false)}
          stat={toggleDetailOverlay}
          children={
            selectedProduct ? (
              <div className=" w-full h-full">
                <motion.div
                  className={
                    darkMode.value
                      ? "dark-mode top0 left0 product-overlay-loader bg-white full-width h-full flex align-items-center justify-center absolute"
                      : "light-mode top0 left0 product-overlay-loader bg-white full-width h-full flex align-items-center justify-center absolute"
                  }
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="spinner"></div>
                </motion.div>

                <motion.div
                  className="content  product-details-container w-full h-full bold"
                  initial={{ opacity: 0, scale: 1.2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <img
                    alt=""
                    src={logoImg}
                    className={
                      darkMode.value ? "inverted-image logo-img" : "logo-img"
                    }
                  />
                  <div className="my-20">
                    <p>Product Details</p>
                    <p className="small-text grey">SportMat Product.</p>
                  </div>

                  <div className="my-20 w-full border-radius-5  prodcut-details-img-container flex align-items-center justify-center">
                    <p className="z-1 absolute sec-text grey back-text center-text">
                      {selectedProduct.name}
                    </p>

                    <div className="slider-img-container relative">
                      <AnimatePresence initial={false} mode="wait">
                        <motion.img
                          key={selectedProduct.imgSrc[currentImageIndex]}
                          src={selectedProduct.imgSrc[currentImageIndex]}
                          alt={"prod img"}
                          className="z-2 img200"
                          initial={{ opacity: 0, scale: 0.8 }} // Initial state before animation
                          animate={{ opacity: 1, scale: 1 }} // Animate to this state
                          exit={{ opacity: 0, scale: 0.8 }} // Exit animation
                        />
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="my-20 prod-desc">
                    <p>Description</p>
                    <p className="small-text grey my-10 ">
                      SportMat Product lorem loremloremloremloremlorem
                      loremlorem lorem lorem lorem lorem lorem lorem lorem lorem
                      lorem lorem lorem lorem lorem SportMat Product lorem
                      loremloremloremloremlorem loremlorem lorem lorem lorem
                      lorem lorem lorem lorem lorem lorem lorem lorem lorem
                      lorem.
                    </p>
                  </div>

                  <div className="my-20">
                    <p>Client Review</p>

                    <div className="reviews-container  my-10 flex align-items-center">
                      {reviews.length === 0 ? (
                        <div className="review-container relative px-10 py-10 box-sizing bg- border-radius-5 mr-10">
                          <p className="small-text"></p>
                          <p className="grey small-text center-text absolute">
                            ' No Reviews Yet '
                          </p>
                        </div>
                      ) : (
                        reviews.map((review) => {
                          return (
                            review.status && (
                              <div className="review-container relative px-10 py-10 box-sizing bg- border-radius-5 mr-10">
                                <p className="small-text">
                                  {review.client} <br />
                                  <span className="grey smaller-text">
                                    {review.date}
                                  </span>
                                </p>

                                <p className="grey small-text center-text absolute">
                                  ' {review.review} '
                                </p>
                              </div>
                            )
                          );
                        })
                      )}
                    </div>

                    <div className="w-full  my-20">
                      <div className="flex align-items-center justify-space-between">
                        <motion.div
                          className="action-button my-10 mx-5"
                          initial={{
                            actionBtnBgColor: "#C7253E",
                            color: darkMode ? "black" : "white",
                          }}
                          animate={{
                            backgroundColor: "rgba(99, 99, 99, 0.4)",
                            color: darkMode ? "white" : "white",
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          onClick={() => {
                            if (currentUser) {
                              setToggleReviewOverlay(true);
                            } else {
                              setToggleOverlay(true);
                            }
                          }}
                        >
                          <p className="btn">Add Review</p>
                        </motion.div>

                        <div
                          className="flex align-items-center"
                          onClick={() => {
                            setAnimateCart(true);
                            setTimeout(() => setAnimateCart(false), 200);
                            addToCart(selectedProduct);
                          }}
                        >
                          <img
                            alt=""
                            src={add}
                            className="small-icon max-z pointer cursor"
                          />
                          <motion.div
                            className="action-button mx-5"
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
                              setToggleProductOverlay(true);
                            }}
                          >
                            <p className="btn">Passer Votre Commande</p>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : null
          }
        />

        <OverlayContainer
          contentHeight="30%"
          contentWidth="55%"
          darkMode={darkMode.value}
          className={"review-overlay"}
          toggleOverlay={() => setToggleReviewOverlay(false)}
          stat={toggleReviewOverlay}
          children={
            <div className=" review-form">
              <div>
                <motion.div
                  className={
                    darkMode.value
                      ? "dark-mode top0 left0 product-overlay-loader bg-white full-width h-full flex align-items-center justify-center absolute"
                      : "top0 left0 product-overlay-loader bg-white full-width h-full flex align-items-center justify-center absolute"
                  }
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="spinner"></div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 1.2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bold review-form-content"
                >
                  <img
                    alt=""
                    src={logoImg}
                    className={
                      darkMode.value ? "inverted-image logo-img" : "logo-img"
                    }
                  />

                  <div className="flex justify-space-between w-full">
                    <div className="my-20 review-left">
                      <p>Product Reviews</p>
                      <p className="small-text grey">SportMat.</p>
                    </div>

                    <div className="w-full">
                      <div className="input-container relative">
                        <textarea
                          placeholder="Your Review..."
                          className={
                            darkMode.value ? "white input" : "black input"
                          }
                          value={reviewVal}
                          onChange={(e) => {
                            setReviwVal(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex align-items-center justify-space-between my-20">
                    <p
                      className="small-text grey pointer z-3"
                      onClick={() => {
                        setToggleReviewOverlay(false);
                      }}
                    >
                      Back
                    </p>

                    <motion.div
                      className="action-button mx-5"
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
                        if (reviewVal !== "") {
                          setReviewClickLoading(true);
                          const reviewData = {
                            associatedProduct: selectedProduct.id,
                            createdAt: new Date().toISOString().split("T")[0],
                            createdBy: currentUser
                              ? currentUser.email
                              : "zineddinezebiri@gmail.com",
                            reviewText: reviewVal,
                            reviewerName: currentUser
                              ? currentUser.name
                              : "zineddine",
                          };

                          saveReview(reviewData)
                            .then((response) => {
                              console.log(
                                "Review saved successfully:",
                                response.key
                              );

                              setTimeout(() => {
                                setReviewClickLoading(false);

                                setToggleReviewOverlay(false);
                                setReviwVal("");
                              }, 1000);
                            })
                            .catch((error) => {
                              console.error("Error:", error);
                            });
                        }
                      }}
                    >
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={
                          !reviewClickLoading ? { opacity: 1 } : { opacity: 0 }
                        }
                        className="btn"
                      >
                        Leave Your Comment
                      </motion.p>

                      <motion.div
                        className="btn-loader absolute flex justify-center align-items-center top0 z-1"
                        initial={{ opacity: 0 }}
                        animate={
                          reviewClickLoading ? { opacity: 1 } : { opacity: 0 }
                        }
                      >
                        <img src={whiteLoader} alt="loading" />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          }
        />

        <OverlayContainer
          contentHeight="85%"
          contentWidth="90%"
          darkMode={darkMode.value}
          toggleOverlay={() => setToggleProductOverlay(false)}
          stat={toggleProductOverlay}
          children={
            selectedProduct ? (
              <div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="product-page-container bold"
                >
                  <motion.img
                    alt=""
                    src={logoImg}
                    className={
                      darkMode.value
                        ? "inverted-image logo-img mobile"
                        : "logo-img mobile"
                    }
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  />
                  <motion.div
                    className="my- review-left "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="mobile">Product Orders</p>
                    <p className="small-text grey mobile">SportMat.</p>
                  </motion.div>

                  <motion.div
                    className="form-container flex-column align-items-center"
                    transition={{ delay: isInitialLoad ? 0.9 : 0 }}
                  >
                    <motion.div
                      className="mobile slider-img-container relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="z-1 absolute sec-text grey back-text center-text">
                        {selectedProduct.name}
                      </p>
                      <AnimatePresence initial={false} mode="wait">
                        <motion.img
                          key={"images[currentImageIndex].id"}
                          src={selectedProduct.imgSrc[0]}
                          alt={"images[currentImageIndex].alt"}
                          className="z-2 img200"
                          initial={{ opacity: 0, scale: 0.8 }} // Initial state before animation
                          animate={{ opacity: 1, scale: 1 }} // Animate to this state
                          exit={{ opacity: 0, scale: 0.8 }} // Exit animation
                        />
                      </AnimatePresence>
                    </motion.div>

                    <Form
                      inputs={inputs}
                      actionBtnText="Order Now"
                      selectedNavIndex={selectedNavIndex}
                      submitHandler={handleSubmit}
                    >
                      {/* Add your inputs here */}
                    </Form>
                  </motion.div>

                  <motion.div
                    className="absolute-div"
                    initial={{ width: "45%" }}
                    animate={{ width: "35%" }}
                    transition={{ delay: 1 }}
                  >
                    <motion.img
                      src={selectedProduct.imgSrc[0]}
                      initial={{ right: "60%" }}
                      animate={{ right: "42%", transition: { delay: 1 } }}
                    />

                    <motion.div
                      className="rotated-back-text"
                      initial={{ left: "-30%" }}
                      animate={animations.rotatedBackText}
                      transition={{ delay: 1 }}
                    >
                      <p>MyWebSite.</p>
                    </motion.div>

                    <motion.div
                      className="white desc-container"
                      initial={{ left: "20%" }}
                      animate={animations.descContainer}
                      transition={{ delay: 1 }}
                    >
                      <h1 className="white z-text fit-content">
                        {selectedProduct.name}
                      </h1>

                      <p className="grey bold">{selectedProduct.description}</p>

                      <div className="flex align-items-center justify-center price my-20 black">
                        <p>
                          {selectedProduct.price} <span>DA</span>
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex align-items-center justify-center social-imgs"
                      initial={animations.socialImgsBack}
                      animate={{ bottom: "5%" }}
                      transition={{ delay: 1 }}
                    >
                      <img src={fb} className="mx-20" />
                      <img src={insta} className="mx-10" />
                      <img src={tiktok} className="mx-20" />
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className={
                    darkMode.value
                      ? "dark-mode top0 left0 product-overlay-loader bg-white full-width h-full flex align-items-center justify-center absolute"
                      : "top0 left0 product-overlay-loader bg-white full-width h-full flex align-items-center justify-center absolute"
                  }
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="spinner"></div>
                </motion.div>
              </div>
            ) : null
          }
        ></OverlayContainer>

        <OverlayContainer
          contentHeight="85%"
          className={"cart-z"}
          contentWidth="40%"
          darkMode={darkMode.value}
          toggleOverlay={() => setToggleCartOverlay(false)}
          stat={toggleCartOverlay}
          children={
            <CartOverlayConent
              setToggleCartOverlay={setToggleCartOverlay}
              items={initialCartItems}
              setItems={setInitialCartItems}
              removeFromCart={removeFromCart}
              darkMode={darkMode.value}
              submitCartForm={() => {
                if (currentUser) {
                  if (initialCartItems.length > 0)
                    setToggleCompleteInfosOverlay(true);
                } else {
                  setToggleOverlay(true);
                }
              }}
            />
          }
        />
      </motion.div>

      <div>
        <motion.div
          className="side-menu-blur mobile"
          initial={{ right: "-100%" }}
          animate={toggleFilterSideOverlay ? { right: 0 } : { right: "-110%" }}
        ></motion.div>
      </div>
      <motion.div
        className={
          darkMode.value
            ? "dark-mode side-overlay  sideMenu filter-sideMenu fixed mobile"
            : "side-overlay  sideMenu filter-sideMenu fixed mobile"
        }
        initial={{ right: "-100%" }}
        animate={toggleFilterSideOverlay ? { right: 0 } : { right: "-100%" }}
      >
        <motion.div
          className="filters-container bold absolute h-full top0 left0"
          style={darkMode.value ? { backgroundColor: "#222831" } : {}}
        >
          <p>Filter</p>
          <div className="filter-container">
            <p className="grey small-text ">Brand</p>
            <div className="filter-options">
              <SelectOption
                options={allBrands}
                onOptionSelect={setSelectedBrand}
              />
            </div>
          </div>

          <div className="filter-container">
            <p className="grey small-text my-10">Tags</p>
            <div className="filter-options grid-filter-options">
              {allTags.map((tag, index) => {
                return (
                  <motion.div
                    className="filter tag"
                    initial={{ backgroundColor: "white", color: "gray" }}
                    animate={
                      selectedTags.includes(tag)
                        ? { backgroundColor: "#c7253e", color: "white" }
                        : darkMode.value
                        ? { backgroundColor: "#222831", color: "white" }
                        : { backgroundColor: "white", color: "gray" }
                    }
                    onClick={() => toggleTagSelection(tag)}
                  >
                    <p>{tag}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="filter-container">
            <p className="grey small-text my-10">Price</p>
            <div className="filter-options">
              <input
                type="text"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />

              <input
                type="text"
                placeholder="Max Price"
                className="my-10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="actions my-20 flex justify-space-between align-items-center">
            <p
              className="small-text grey my-20"
              onClick={() => setToggleFilterSideOverlay(false)}
            >
              Back
            </p>
            <div className="my-20"></div>
          </div>
        </motion.div>
      </motion.div>

      <div>
        <motion.div
          className="side-menu-blur"
          initial={{ right: "-100%" }}
          animate={toggleSideOverlay ? { right: 0 } : { right: "-110%" }}
        ></motion.div>
      </div>
      <motion.div
        className={
          darkMode.value
            ? "dark-mode side-overlay  sideMenu fixed"
            : "side-overlay  sideMenu fixed"
        }
        initial={{ right: "-100%" }}
        animate={toggleSideOverlay ? { right: 0 } : { right: "-100%" }}
      >
        <div
          className={
            darkMode.value
              ? "dark-mode bold flex-column  overflow-auto h-full"
              : " bold flex-column  overflow-auto h-full"
          }
        >
          <div className="flex-column align-items-center justify-center w-full">
            <div className="user-circle white flex align-items-center justify-center">
              <p>{currentUser ? currentUser.name[0].toUpperCase() : ""}</p>
            </div>
            <p className="my-10">Hi, {currentUser ? currentUser.name : ""}.</p>
            <p className="small-text grey">
              {currentUser ? currentUser.email : ""}
            </p>
          </div>

          <div className="my-20">
            <div className="input-container">
              <p className="label small-text">Name</p>
              <input
                placeholder={
                  currentUser
                    ? currentUser.displayName
                      ? currentUser.displayName
                      : currentUser.name
                    : ""
                }
              />
            </div>

            <div className="input-container">
              <p className="label small-text">Email</p>
              <input placeholder={currentUser ? currentUser.email : ""} />
            </div>

            <div className="input-container">
              <p className="label small-text">Phone</p>
              <input
                placeholder={
                  currentUser
                    ? currentUser.loginSrc === "email"
                      ? currentUser.dataInfos.phone
                      : currentUser.phone
                    : "Phone Number"
                }
              />
            </div>
          </div>

          <div className="my-20">
            <p className="small-text">Favoris</p>
            <div className="flex fav-slider my-10">
              <div className="fav-item pointer bg-grey img100 mr-10 px-10 py-10 box-sizing border-radius-5 flex align-items-center justify-center">
                <img alt="" src={prod4} className="" />
              </div>

              <div className="fav-item pointer bg-grey img100 mr-10 px-10 py-10 box-sizing border-radius-5 flex align-items-center justify-center">
                <img alt="" src={prod2} className="" />
              </div>

              <div className="fav-item pointer bg-grey img100 mr-10 px-10 py-10 box-sizing border-radius-5 flex align-items-center justify-center">
                <img alt="" src={prod3} className="" />
              </div>
              <div className="fav-item pointer bg-grey img100 mr-10 px-10 py-10 box-sizing border-radius-5 flex align-items-center justify-center">
                <img alt="" src={prod5} className="" />
              </div>
            </div>
          </div>

          <div className="actions flex justify-space-between align-items-center">
            <p
              className="small-text grey my-20 pointer"
              onClick={() => setToggleSideOverlay(false)}
            >
              Back
            </p>
            <motion.div
              className="action-button mx-5"
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
                setToggleSideOverlay(false);
                Swal.fire({
                  title: "Log Out",
                  html: `<p class="popup-custom-text small-text grey bold"> ${currentUser.name} , Do you want to log Out?</p>`,

                  icon: "question",
                  iconColor: "#C7253E",

                  confirmButtonText: "confirm",
                  confirmButtonColor: "#C7253E",
                  scrollbarPadding: true,

                  customClass: {
                    popup: "popup",
                    icon: "custom-icon",
                    container: "popup-container",
                    confirmButton: "confirmButton",
                    validationMessage: "validationMessage",
                    title: "popup-custom-title",
                    image: "custom-image",
                  },
                }).then((res) => {
                  if (res.isConfirmed) {
                    handleLogout();
                  }
                  //alert();
                  //logOutHandler()
                });
              }}
            >
              <p className="btn">Log Out</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <OverlayContainer
        className={"max-z"}
        contentHeight="90%"
        contentWidth="60%"
        darkMode={darkMode.value}
        toggleOverlay={() => setToggleOverlay(false)}
        stat={toggleOverlay}
        children={
          <div className="bold login-container w-full h-full flex-column align-items-center justify-center">
            <p className="sec-text">
              BienVenu, Une{" "}
              <span>
                autre Fois <span className="red">!</span>
              </span>
            </p>
            <p className="label">Username</p>
            <div className="input-container relative">
              <input
                placeholder="Entrez votre Nom d'utilisateur Ici"
                value={username}
                onChange={(e) => {
                  setUsername((username) => e.target.value);
                }}
              />
              <img
                src={userIcon}
                alt=""
                className="absolute right0 small-icon"
              />
            </div>
            <p className="label">Password</p>

            <div className="input-container relative">
              <input
                placeholder="Entrez votre Mot De Passe Ici"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword((password) => e.target.value);
                }}
              />
              <img
                src={PasswordIcon}
                alt=""
                className="absolute right0 small-icon pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            </div>

            <div className="relative login-actions display flex justify-space-between align-items-center">
              <motion.div className="action-button  bg-red">
                <motion.p
                  className="btn"
                  initial={{ opacity: 1 }}
                  animate={!loginLoading ? { opacity: 1 } : { opacity: 0 }}
                  onClick={(e) => {
                    handleLoginClick(e);
                  }}
                >
                  Se Connecter
                </motion.p>

                <motion.div
                  className="btn-loader absolute flex justify-center align-items-center top0 z-1"
                  initial={{ opacity: 0 }}
                  animate={loginLoading ? { opacity: 1 } : { opacity: 0 }}
                >
                  <img src={whiteLoader} alt="" />
                </motion.div>
              </motion.div>

              <p
                className="small-text grey my-10 pointer"
                onClick={() => {
                  setToggleCreateAcountOverlay(true);
                }}
              >
                C'est Votre Premiere Fois Ici? Créer Votre Compte.
              </p>

              <motion.p
                className="absolute small-text grey my-10 login-err"
                initial={{ opacity: 0 }}
                animate={loginError ? { opacity: 1 } : { opacity: 0 }}
              >
                {loginError}
                {"   "}
              </motion.p>
            </div>

            <div className="half-width-hr hr my-20"></div>
            <p className="small-text my-20 flex justify-center">
              Ou, Utilisez:
            </p>

            <div className="social-container flex justify-space-evenly align-items-center">
              <div
                className="social-login-btn white "
                onClick={handleGoogleSignIn}
              >
                <img src={google} alt="" className="mx-10 small-icon" />
                <p className="btn">Google</p>
              </div>
            </div>
          </div>
        }
      />

      <OverlayContainer
        contentHeight="65%"
        contentWidth="35%"
        darkMode={darkMode.value}
        toggleOverlay={() => setToggleCompleteInfosOverlay(false)}
        stat={toggleCompleteInfosOverlay}
        children={
          <div className="bold completeForm-container w-full h-full flex-column align-items-center justify-center">
            <motion.div
              className={
                darkMode.value
                  ? "dark-mode flex-column align-items-end"
                  : "flex-column align-items-end"
              }
            >
              <p className="text">You are Almost There, Complete Your Info.</p>

              <div className="input-container my-10">
                <p className="label">Phone</p>
                <input
                  placeholder="Tap Your Phone Here"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="input-container my-10">
                <p className="label">Wilaya</p>
                <input
                  placeholder="Tap Your Wilaya Here"
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                />
              </div>

              <div className="input-container my-10">
                <p className="label">Address</p>
                <input
                  placeholder="Tap Your Address Here"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div
                className="action-button bg-red my-20"
                onClick={() => completeFormHandler()}
              >
                <p className="btn">Order Now</p>
              </div>
            </motion.div>
          </div>
        }
      />

      <OverlayContainer
        contentHeight="85%"
        contentWidth="35%"
        darkMode={darkMode.value}
        toggleOverlay={() => setToggleCreateAcountOverlay(false)}
        stat={toggleCreateAcountOverlay}
        children={
          <div className="bold w-full h-full flex-column align-items-center justify-center relative">
            <SignUpOverlayContent
              darkMode={darkMode.value}
              showEmailVerificationOverlay={setShowEmailVerificationOverlay}
              setUsername={setUsername}
              setPassword={setPassword}
              handleLoginClick={() => handleLoginClick()}
              toggleOverlay={() => setToggleCreateAcountOverlay(false)}
            />
          </div>
        }
      />

      <OverlayContainer
        contentHeight="35%"
        contentWidth="40%"
        darkMode={darkMode.value}
        toggleOverlay={() => setShowEmailVerificationOverlay(false)}
        stat={showEmailVerificationOverlay}
        children={
          <div className="bold w-full h-full flex-column align-items-center justify-center relative">
            <p className="small-text center-text">
              We Sent A Verification Link To Your Email, Please Check Your Mail
              and Follow The Instructions.
            </p>
            <p className="small-text center-text grey my-20">
              This Pop Up Will Be Hidden Once You Verifiy Your Email Adress.
            </p>

            <div className="flex-column align-items-center">
              <p className="small-text center-text">Waiting Verification...</p>
              <img
                alt=""
                src={whiteLoader}
                className={
                  darkMode.value
                    ? "logo-img absolute bottom0"
                    : "inverted-image logo-img absolute bottom0"
                }
              />
            </div>
          </div>
        }
      />

      <NetTestOverlay darkMode={darkMode.value} />
      <FlashPopUp content={flashSaleContent} darkMode={darkMode.value} />
    </div>
  ) : null;
}

export default Home;
