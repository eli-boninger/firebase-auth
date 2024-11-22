import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        if (!!e.target.password.value && !!e.target.email.value) {
            const userCredential = await signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value);
            const user = userCredential.user;

            console.log(user);

            if (user) {
                navigate('/');
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="login-form">
                <label className="login-form__label">
                    Email*
                    <input type="email" name="email" id="email" />
                </label>
                <label className="login-form__label">
                    Password*
                    <input type='password' name='password' id='password' />
                </label>

                <button type='submit'>Sign Up</button>
            </form>
            <p>
                Need to create an account? <Link to="/register">Sign up</Link>
            </p>
        </>

    );
};