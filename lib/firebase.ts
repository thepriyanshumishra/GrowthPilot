import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBbfvj1LzQrC5K1tpqATD5TuKY1sj1s3No",
    authDomain: "growthpilot-firebase.firebaseapp.com",
    projectId: "growthpilot-firebase",
    storageBucket: "growthpilot-firebase.firebasestorage.app",
    messagingSenderId: "802736720095",
    appId: "1:802736720095:web:3d8d041f16c3c3536a816a",
    measurementId: "G-VG31RM7EQL"
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
