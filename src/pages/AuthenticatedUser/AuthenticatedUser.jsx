import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";

export const AuthenticatedUser = () => {
    const auth = getAuth();
    const user = useContext(UserContext);

    useEffect(() => {
        const makeAsyncRequest = async () => {
            const userIdToken = await user.getIdToken();
            await axios.get(`http://localhost:8080?token=${userIdToken}`);
        };

        if (user) {
            makeAsyncRequest();
        }

    }, [user]);

    return (
        <>
            <div>Authenticated as {user?.email}</div>
            <button onClick={() => signOut(auth)}>Sign Out</button>
        </>

    );
};