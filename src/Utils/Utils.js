import { database } from "../Firebase/firebaseConfig"; // Firebase configuration and initialization
import { ref, get, set, push, child, update } from "firebase/database";

// Database paths
const productsRef = ref(database, "products");
const ordersRef = ref(database, "orders");

const tagsRef = ref(database, "tags");

/**
 * Fetch all products from Firebase Realtime Database
 * @returns {Promise<Array>} - List of all products
 */
export const getAllProducts = async () => {
  try {
    if (productsRef) {
      const snapshot = await get(productsRef);
      if (snapshot.exists()) {
        const productsData = snapshot.val();
        return Object.keys(productsData).map((key) => ({
          id: key,
          ...productsData[key],
        }));
      } else {
        console.log("No products found");
        return [];
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

/**
 * Fetch a single product by ID from Firebase Realtime Database
 * @param {string} productId - The ID of the product
 * @returns {Promise<Object|null>} - The product object if found, null if not
 */
export const getProductById = async (productId) => {
  try {
    if (productsRef) {
      const productSnapshot = await get(child(productsRef, productId));
      if (productSnapshot.exists()) {
        return { id: productSnapshot.key, ...productSnapshot.val() };
      } else {
        console.error("No product found with the given ID");
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

/**
 * Fetch all unique tags from the product collection
 * @returns {Promise<Array>} - List of unique tags
 */
export const getAllTags = async () => {
  try {
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const productsData = snapshot.val();
      const tagsSet = new Set();

      Object.values(productsData).forEach((product) => {
        if (product.tags && Array.isArray(product.tags)) {
          product.tags.forEach((tag) => tagsSet.add(tag));
        }
      });

      return Array.from(tagsSet);
    } else {
      console.log("No products found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Could not fetch tags");
  }
};

/**
 * Save an order to Firebase Realtime Database
 * @param {Object} orderData - The order data to save
 * @returns {Promise<Object>} - The saved order reference
 */
export const saveOrder = async (orderData) => {
  try {
    const newOrderRef = push(ordersRef); // Create a new reference for the order
    await set(newOrderRef, orderData); // Save order data to that reference
    console.log("Order saved with ID:", newOrderRef.key);
    return newOrderRef;
  } catch (error) {
    console.error("Error saving order:", error);
    throw new Error("Could not save order");
  }
};

export const incrNumberSales =  async(productId)=> {
    console.log("incr " + productId);
  try {
    // Reference to the product's numberSales property in the database
    const productRef = ref(database, `products/${productId}/numberSales`);

    console.log("incr before");

    // Retrieve the current number of sales
    const snapshot = await get(productRef);

    console.log("incr after");
    let updatedSales;
    if (snapshot.exists()) {
      // Increment existing numberSales value
      const currentSales = snapshot.val();
      updatedSales = currentSales + 1;
      console.log("incr...." + updatedSales);
    } else {
      // Initialize numberSales to 1 if it doesn't exist
      updatedSales = 1;
      console.log("incr...." + updatedSales);
    }

    // Update the numberSales in the database
    await update(ref(database, `products/${productId}`), {
      numberSales: updatedSales,
    });

    console.log(
      `Product ${productId} sales updated successfully to ${updatedSales}`
    );
  } catch (error) {
    console.error("Error incrementing product sales:", error);
  }
}


export const getReviewsById = async (idProduct) => {
    try {
      // Reference to the reviews collection in the database
      const reviewsRef = ref(database, "reviews");
      const snapshot = await get(reviewsRef);
  
      if (snapshot.exists()) {
        const reviewsData = snapshot.val();
        // Filter reviews by associatedProduct to match the given product ID
        const filteredReviews = Object.keys(reviewsData)
          .filter((key) => reviewsData[key].associatedProduct === idProduct)
          .map((key) => ({
            id: key,
            ...reviewsData[key],
          }));
  
        return filteredReviews;
      } else {
        console.log("No reviews found for the specified product");
        return [];
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw new Error("Could not fetch reviews");
    }
  };


  export const saveReview = async (reviewData) => {
    try {
      const newReviewRef = push(ref(database, "reviews")); // Create a new reference for the review
  
      // Prepare the review data with default values
      const reviewWithDefaults = {
        rating: 5,
        status: false,
        ...reviewData,
      };
  
      await set(newReviewRef, reviewWithDefaults); // Save review data to that reference
  
      console.log("Review saved with ID:", newReviewRef.key);
      return newReviewRef;
    } catch (error) {
      console.error("Error saving review:", error);
      throw new Error("Could not save review");
    }
  };