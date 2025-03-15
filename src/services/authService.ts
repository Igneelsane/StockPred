import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, database } from "../firebase/config";

// Register a new user
export const registerUser = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save additional user info to the database
    await set(ref(database, `users/${user.uid}`), {
      email,
      displayName,
      savedStocks: [],
      createdAt: new Date().toISOString()
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Save a stock to user's saved stocks
export const saveStock = async (userId: string, stockSymbol: string, stockName: string) => {
  try {
    const userStocksRef = ref(database, `users/${userId}/savedStocks`);
    const snapshot = await get(userStocksRef);
    
    let savedStocks = snapshot.exists() ? snapshot.val() : [];
    
    // Check if stock already exists
    if (!Array.isArray(savedStocks)) {
      savedStocks = [];
    }
    
    if (!savedStocks.some((stock: any) => stock.symbol === stockSymbol)) {
      savedStocks.push({
        symbol: stockSymbol,
        name: stockName,
        savedAt: new Date().toISOString()
      });
      
      await set(userStocksRef, savedStocks);
    }
    
    return savedStocks;
  } catch (error) {
    throw error;
  }
};

// Remove a stock from user's saved stocks
export const removeStock = async (userId: string, stockSymbol: string) => {
  try {
    const userStocksRef = ref(database, `users/${userId}/savedStocks`);
    const snapshot = await get(userStocksRef);
    
    if (snapshot.exists()) {
      let savedStocks = snapshot.val();
      
      if (!Array.isArray(savedStocks)) {
        return [];
      }
      
      savedStocks = savedStocks.filter((stock: any) => stock.symbol !== stockSymbol);
      await set(userStocksRef, savedStocks);
      
      return savedStocks;
    }
    
    return [];
  } catch (error) {
    throw error;
  }
};

// Get user's saved stocks
export const getSavedStocks = async (userId: string) => {
  try {
    const userStocksRef = ref(database, `users/${userId}/savedStocks`);
    const snapshot = await get(userStocksRef);
    
    if (snapshot.exists()) {
      const savedStocks = snapshot.val();
      return Array.isArray(savedStocks) ? savedStocks : [];
    }
    
    return [];
  } catch (error) {
    throw error;
  }
};