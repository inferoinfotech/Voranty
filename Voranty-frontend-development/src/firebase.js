import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA9lIXRyGtOgOZmpTDh0Qdb0_kU7g65aJQ",
  authDomain: "voranty-ea71e.firebaseapp.com",
  projectId: "voranty-ea71e",
  storageBucket: "voranty-ea71e.appspot.com", 
  messagingSenderId: "115021114522",
  appId: "1:115021114522:web:dbd39270a550a2e63ac323",
  measurementId: "G-6BJ9KC2R1Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); 
export const googleAuthProvider = new GoogleAuthProvider(); 
export default app;
