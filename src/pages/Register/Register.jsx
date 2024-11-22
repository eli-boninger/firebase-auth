import "./Register.scss";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const Register = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();

        const auth = getAuth();
        const [email, password, confirmPassword] = [e.target.email.value, e.target.password.value, e.target.confirm.value];
        if (password === confirmPassword && !!email && !!password) {
            const userCredential = await createUserWithEmailAndPassword(auth, e.target.email.value, e.target.password.value);
            const user = userCredential.user;

            console.log(user);
        } else {
            // display validation errors
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
                <input type='password' name='password' id='password' />
            </label>
            <label className="register-form__label">
                Confirm Password*
                <input type='password' name='confirm' id='confirm' />
            </label>

            <button type='submit'>Sign Up</button>
        </form>
    );
};