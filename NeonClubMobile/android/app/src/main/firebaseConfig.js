// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Your Firebase configuration (from console)
const firebaseConfig = {
  apiKey: "AIzaSyC4R2gSm9EEKeNawmbTvdBRZ7CoA8nOpoo",
  authDomain: "napp-5b6cd.firebaseapp.com",
  projectId: "napp-5b6cd",
  storageBucket: "napp-5b6cd.appspot.com",
  messagingSenderId: "496866331875",
  appId: "1:496866331875:web:ba92965c3a67e7733c49d6",
  measurementId: "G-JSMHTT3KMD",
};

// ✅ Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);
//SHA1: 10:11:27:23:C5:01:BC:72:93:9D:FF:EC:A6:22:2E:17:CF:BE:37:22
// ✅ Export the Auth instance for OTP
export const auth = getAuth(app);
