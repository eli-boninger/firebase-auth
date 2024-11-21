import "./Register.scss";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const Register = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();

        const auth = getAuth();
        if (e.target.password.value === e.target.confirm.value && !!e.target.email.value && !!e.target.password.value) {
            const userCredential = await createUserWithEmailAndPassword(auth, e.target.email.value, e.target.password.value);
            const user = userCredential.user;

            console.log(user);
        } else {

        }

    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <label className="register-form__label">
                Email*
                <input type="email" name="email" id="email" />
            </label>
            <label className="register-form__label">
                Password*
                <input type='password' name='passowrd' id='password' />
            </label>
            <label className="register-form__label">
                Confirm Password*
                <input type='password' name='confirm' id='confirm' />
            </label>

            <button type='submit'>Sign Up</button>
        </form>
    );
};