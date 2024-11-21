import './App.css';
import { Register } from './components/Register/Register';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from './config/firebase';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  // Initialize Firebase

  return (
    <>
      <Register />
    </>
  );
}

export default App;
