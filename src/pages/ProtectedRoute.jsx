import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

export const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
            setUser(fbUser);
            if (!fbUser) {
                navigate('/login');
            }
        });
        return unsubscribe;
    }, []);


    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};