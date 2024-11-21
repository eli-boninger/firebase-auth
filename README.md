# Firebase + React

## Create a firebase project
1. Navigate to the [firebase console](https://console.firebase.google.com/u/0/?pli=1). Select "Get started with a Firebase project".
2. Enter a project name and continue.
3. You can choose whether or not you'd like to enable Google Analytics.
4. Create the project.

## Set up the React app.
1. Use vite to bootstrap a new react application.

## Register your React app
1. In the firebase console for your new project, select the `</>` icon (web).
2. Optionally nickname it something like "react app". Don't set up hosting at this time.
3. In your vite app, run `npm i firebase`.
4. Create a directory `config/` inside the `src` folder and add a file `firebase.js`.
5. Copy the generated firebase config object into this file and export it:
```js
export const firebaseConfig = {
    apiKey: ...,
    authDomain: ...,
    projectId: ...,
    storageBucket: ...,
    messagingSenderId: ...,
    appId: ...
};
```
6. In your App.jsx, add these lines:
```jsx
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from './config/firebase';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

## Set up authentication with Firebase
1. Inside your firebase config file, add the follow import:
```
import { getAuth } from "firebase/auth";
```
2. After the `initializeApp` call, add this line:
```
const auth = getAuth(app);
```

## Add authentication method(s) to Firebase app
1. From the main portal, click Authentication, then "Get Started".
2. Select email/password auth. Enable "Email/Password" only (not Email link). For now.

## Create a registration form
Create your own form or copy this one:
```jsx
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
```
