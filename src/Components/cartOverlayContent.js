import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import whiteLoader from "../assets/whiteLoader.gif";
import removeIcon from "../assets/removeIcon.png";

const CartOverlayConent = ({
  setToggleCartOverlay,
  items,
  setItems,
  removeFromCart,
  toggleReviewOverlay,
  darkMode,
  submitCartForm
}) => {
  const [commandeClickLoading, setCommandeClickLoading] = useState(false);

  // Function to handle quantity change
  const handleQuantityChange = (id, operation) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        if (operation === "increase") {
          return { ...item, quantity: item.quantity + 1 };
        } else if (operation === "decrease" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });
    setItems(updatedItems);
  };

  // Calculate total price
  const totalPrice = items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className=" cart-overlay-container f-height relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className=" bold flex-column z-3 top-z relative cart-overlay-content"
      >
        <div>
          <p>Your Cart</p>
          <p className="small-text grey">SportMat.</p>
        </div>

        <div className="cart-items my-20 relative">
          {items.map((item) => (
            <div className="cart-item my-10" key={item.id}>
              <div className="cart-item-left flex align-items-center justify-space-between">
                <div className="flex align-items-center">
                  <div className="cart-item-img bg-grey relative flex align-items-center justify-center ">
                    <img src={item.image} alt={item.name} className="" />
                  </div>

                  <div className="cart-item-infos ml-40">
                    <p className="small-text grey">{item.name}</p>
                    <p>{item.description}</p>
                    <p className="small-text">{item.unitPrice} DA</p>
                    <div className="flex my-10">
                      <div
                        className="bg-red white small-icon border-radius-5 flex align-items-center justify-center pointer"
                        onClick={() =>
                          handleQuantityChange(item.id, "increase")
                        }
                      >
                        <p>+</p>
                      </div>

                      <p className="red mx-10">{item.quantity}</p>

                      <div
                        className="bg-grey small-icon border-radius-5 flex align-items-center justify-center pointer"
                        onClick={() =>
                          handleQuantityChange(item.id, "decrease")
                        }
                      >
                        <p>-</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="unit-price-container">
                  <p>Price</p>
                  <p className="red">
                    {item.unitPrice * item.quantity}.00{" "}
                    <span className="small-text grey">DA</span>
                  </p>

                  <img
                    alt=""
                    src={removeIcon}
                    className="small-icon absolute"
                    onClick={() => removeFromCart(item.id)}
                  />
                </div>
              </div>
            </div>
          ))}

          <motion.div
            className="absolute center-text flex align-items-center justify-center w-full h-full"
            initial={{ opacity: 1 }}
            animate={
              !items || items.length === 0 ? { opacity: 1 } : { opacity: 0 }
            }
          >
            <p>No Items, Please Add Your Articles And Re-Open This Page.</p>
          </motion.div>
        </div>

        <div className="cart-actions absolute bottom0 left0 f-width flex align-items-center justify-space-between">
          <div>
            <p className="small-text grey">Total Price</p>
            <p className="red">
              {totalPrice}.00 <span className="small-text grey">DA</span>
            </p>
          </div>

          <div className="flex align-items-center ">

            <motion.div className="action-button bg-red">
              <motion.p
                className="btn"
                initial={{ opacity: 1 }}
                animate={
                  !commandeClickLoading ? { opacity: 1 } : { opacity: 0 }
                }
                onClick={() => {


                  submitCartForm()
                  
                  setCommandeClickLoading(true);
                  
                }}
              >
                Passez Votre Commande
              </motion.p>

              <motion.div
                className="btn-loader absolute flex justify-center align-items-center top0 z-1"
                initial={{ opacity: 0 }}
                animate={commandeClickLoading ? { opacity: 1 } : { opacity: 0 }}
              >
                <img src={whiteLoader} alt="loading" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className= {darkMode ? "dark-mode top0 left0 product-overlay-loader bg-white full-width h-full flex align-items-center justify-center absolute" : "top0 left0 product-overlay-loader bg-white full-width h-full flex align-items-center justify-center absolute"}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="spinner"></div>
      </motion.div>
    </div>
  );
};

export default CartOverlayConent;
