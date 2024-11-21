import './App.css';
import { Register } from './pages/Register/Register';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { firebaseConfig } from './config/firebase';
import { Login } from './pages/Login/Login';
import { AuthenticatedUser } from './pages/AuthenticatedUser/AuthenticatedUser';
import { ProtectedRoute } from './pages/ProtectedRoute';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AuthenticatedUser /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
