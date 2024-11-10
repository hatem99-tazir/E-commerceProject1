import { useState } from "react";
import { motion } from "framer-motion";
import { auth, database } from "../Firebase/firebaseConfig"; // Firebase setup file
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import logoImg from "../assets/sportLogo.png";

const SignUpOverlayContent = ({
  darkMode,
  showEmailVerificationOverlay,
  handleLoginClick,
  setUsername,
  setPassword,
  toggleOverlay
}) => {
  // State variables for form inputs
  const [signUpFirstName, setSignUpFirstName] = useState("");
  const [signUpLastName, setSignUpLastName] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpAddress, setSignUpAddress] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handler functions for each input
  const handleFirstNameChange = (e) => setSignUpFirstName(e.target.value);
  const handleLastNameChange = (e) => setSignUpLastName(e.target.value);
  const handlePhoneChange = (e) => setSignUpPhone(e.target.value);
  const handleEmailChange = (e) => setSignUpEmail(e.target.value);
  const handleAddressChange = (e) => setSignUpAddress(e.target.value);
  const handlePasswordChange = (e) => setSignUpPassword(e.target.value);

  // Submit handler for form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpEmail,
        signUpPassword
      );
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      setIsSubmitted(true); // Indicate submission for UI control if needed

      showEmailVerificationOverlay(true);
      // Poll to check if email is verified
      const intervalId = setInterval(async () => {
        await user.reload(); // Reload user to get latest email verification status

        if (user.emailVerified) {
          showEmailVerificationOverlay(false);
          // Save user data in Firebase Realtime Database only if email is verified
          await set(ref(database, `users/${user.uid}`), {
            firstName: signUpFirstName,
            lastName: signUpLastName,
            phone: signUpPhone,
            email: signUpEmail,
            address: signUpAddress,
            createdAt: new Date().toISOString(),
            uid: user.uid,
            isActive: true,
            password:signUpPassword,
          });

          
          toggleOverlay();
          setUsername(signUpEmail);
          setPassword(signUpPassword);
          handleLoginClick();
          clearInterval(intervalId); // Stop polling
        }
      }, 3000); // Poll every 3 seconds
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Error creating account. Please try again.");
    }
  };

  return (
    <motion.div
      className={
        darkMode.value
          ? "dark-mode flex-column align-items-center relative w-full"
          : "flex-column align-items-end relative w-full"
      }
    >
      <div className="w-full">
        <img
          alt=""
          src={logoImg}
          className={darkMode ? "inverted-image logo-img" : "logo-img"}
        />
        <div className="my-20">
          <p>Account Creation</p>
          <p className="small-text grey">SportMat Accounts.</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="account-creation-form flex-column w-full"
      >
        <div className="input-container my-10">
          <p className="label small-text">First Name</p>
          <input
            type="text"
            placeholder="Enter your first name"
            value={signUpFirstName}
            onChange={handleFirstNameChange}
            required
          />
        </div>

        <div className="input-container my-10">
          <p className="label small-text">Last Name</p>
          <input
            type="text"
            placeholder="Enter your last name"
            value={signUpLastName}
            onChange={handleLastNameChange}
            required
          />
        </div>

        <div className="input-container my-10">
          <p className="label small-text">Email</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={signUpEmail}
            onChange={handleEmailChange}
            required
          />
        </div>

        <div className="input-container my-10">
          <p className="label small-text">Password</p>
          <input
            type="password"
            placeholder="Enter your password"
            value={signUpPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <div className="input-container my-10">
          <p className="label small-text">Phone</p>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={signUpPhone}
            onChange={handlePhoneChange}
            required
          />
        </div>

        <div className="input-container my-10">
          <p className="label small-text">Address</p>
          <input
            type="text"
            placeholder="Enter your address"
            value={signUpAddress}
            onChange={handleAddressChange}
            required
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="action-button bg-red my-20">
            <p className="btn">Create Account</p>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SignUpOverlayContent;
