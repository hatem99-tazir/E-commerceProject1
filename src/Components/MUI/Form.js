import React, { useState } from "react";
import { motion } from "framer-motion";
import { animations } from "../../animations/animations";

const Form = ({ inputs, actionBtnText, selectedNavIndex, submitHandler }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleAnimationComplete = () => {
    setIsInitialLoad(false);
  };

  return (
    <motion.div
      className="commande-form"
      initial={
           {  opacity: 0 }
      }
      animate={
           {  opacity: 1 }
      }
      transition={{ delay:  .9 }}
      onAnimationComplete={handleAnimationComplete}
    >
     <p>
        Welcome! Fill out the Form above and Place your Order
    </p>
      <form>
        {inputs.map((input, index) => (
          <motion.div
            key={index}
            className="input-container"
            initial={
                 { position:"relative", right: "-100px", opacity: 0 }}
            animate={
                 { position:"relative",right: "0", opacity: 1 }
            }
            transition={{ delay:  1 }}
          >
            <label htmlFor={`input-${index}`}>{input.label}</label>
            <input
              id={`input-${index}`}
              type={input.type}
              placeholder={input.placeholder}
              value={input.value? input.value : null}
              onChange={input.onChange? input.onChange : null}
            />
          </motion.div>
        ))}


        <motion.div
          className="flex align-items-end"
          initial={{ right: "-100px", opacity: 0 }
              
          }
          animate={ animations.quantityContainer
              
          }
          transition={{ delay:  .9 }}
        >
          

          <div className="submit-container" onClick={(e) => submitHandler(e)}>
            <button type="submit" >{actionBtnText}</button>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Form;
