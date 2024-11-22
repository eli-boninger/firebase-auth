# Firebase + React

## Create a firebase project
1. Navigate to the [firebase console](https://console.firebase.google.com/u/0/?pli=1). Select "Get started with a Firebase project".
2. Enter a project name and continue.
3. You can choose whether or not you'd like to enable Google Analytics.
4. Create the project.

## Set up the React app.
Use vite to bootstrap a new react application. Remove unnecessary styling and jsx code.

### Register your React app
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
For the secrets in this config, set up environment variables.


6. In your App.jsx, add these lines:
```jsx
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from './config/firebase';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```
This configures your react app to connect to firebase on startup. Check for any console errors at this time.

### Add authentication method(s) to Firebase app
1. From the firebase project console, click Authentication, then "Get Started".
2. Select email/password auth. Enable "Email/Password" only (not Email link). For now.

### Create a registration form
Create your own form or copy this one:
```jsx
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
```

For `handleSubmit` we'll use firebase-provided functions and add some very basic validation:
```jsx
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
```
Because firebase+auth was configured in the previous step, we can now use `getAuth()` anywhere in our react application. Following that, we use `createUserWithEmailAndPassword` to register the user. Both imported as follows:
```jsx
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
```

Export the above as a `Register` component or something similar. By rendering the `Register` component in your App.jsx, you should be able to register a new user via the form and see that the user has been added in the firebase console. You should also see in the browser console that the user details have been logged. If this is not working, check the browser console for errors.

## Create a Login Page
Login is similar. Here is my JSX:
```jsx
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
</>
```
And a similar `handleSubmit`:
```jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    if (!!e.target.password.value && !!e.target.email.value) {
        const userCredential = await signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value);
        const user = userCredential.user;

        console.log(user);
    }
};
```
You can test this similar to how you tested `Register`, using the user you created in the previous step.

### Set up react router
Let's link the above two components to front end routes.

Change the returned JSX of App.jsx to the following:
```jsx
<BrowserRouter>
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
    </Routes>
</BrowserRouter>
```
Now we can hook up the login page to the signup page:
```
<p>
    Need to create an account? <Link to="/register">Sign up</Link>
</p>
```

And vice-versa.

### Add a protected route with a signout button
Create some component that should not be accessible by an unauthenticated user.

You can add a Sign Out button to this component:
```jsx
import { getAuth, signOut } from "firebase/auth";

export const AuthenticatedView = () => {
    const auth = getAuth();

    return (
        <>
            {/* other component code */}
            <button onClick={() => signOut(auth)}>Sign Out</button>
        </>
    )
}
```

Now we'll create a higher-order-component that'll check auth before displaying the component content. You can call this new component `ProtectedRoute.jsx`.

```jsx
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }) => {
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
            if (!fbUser) {
                navigate('/login');
            }
        });
        return unsubscribe;
    }, []);


    return children;
};
```
This component use another firebase-provided function, `onAuthStateChanged`, to subscribe to changes to the authentication state. If a user can no longer be found, the browser should route to the login page.

Finally, we can configure the new route in App.jsx:
```jsx
<Route path="/" element={<ProtectedRoute><AuthenticatedUser /></ProtectedRoute>} />
```
And update the Login/Signup code to navigate to that route on success.

### Create a user context
The last step for our front end is to make user widely available to our components. We can leverage React context for this.

First, we'll define a very simple context in `UserContext.jsx`.
```jsx
import { createContext } from "react";

export const UserContext = createContext(null);
```

The `ProtectedRoute` component can provide the context:
```jsx
import { UserContext } from "../context/UserContext";

// other component code

const [user, setUser] = useState(null);

// update the useEffect to store the user in state
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        setUser(fbUser);
        if (!fbUser) {
            navigate('/login');
        }
    });
    return unsubscribe;
}, []);

// then wrap the return children in the provider
return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
```

Now the context can be leveraged in all of our protected routes via the `useContext` hook:
```jsx
const user = useContext(UserContext);
```

At this point we've got a vaguely functional app with protected routes.

## Set up a server
Now we want our server to be aware of the firebase users, such that we can save user data along with that user's id.
1. Initialize a new node/express application.
2. Install the firebase admin package:
```bash
$ npm install firebase-admin --save
```
3. In the firebase console, navigate to Project settings -> Service accounts.
4. Hit the "Generate new private key" button and confirm. Save this key somewhere secure where you can easily locate it.
5. Add an environment variable with the path to the key. The variable must be named `GOOGLE_APPLICATION_CREDENTIALS`.
```
GOOGLE_APPLICATION_CREDENTIALS=../path/to/json-credential.json
```
6. Use the this code to initialize the app:
```
import { initializeApp, applicationDefault } from 'firebase-admin/app';

initializeApp({ credential: applicationDefault() });
```

### Add middleware to augment the request object with user info
Now that we have an authenticated service account, as long as the api request contains the user's firebase token, we can verify that token to retrieve user information.
```js
import admin from 'firebase-admin';

app.use(async (req, res, next) => {
    const { token } = req.query;

    if (!token) {
        return res.sendStatus(401);
    }

    const userInfo = await admin.auth().verifyIdToken(token);
    req.user = userInfo;
    next();
});
```

To test this out, we can set up a route which just returns the user information in the payload.
```js
app.get('/', (req, res) => {
    res.json(req.user);
});
```

## Bring it all together
To test the endpoint from the previous, and to make our app truly full stack, we can add an API call to our front end code.

Inside a protected route, retrieve the user from the userContext, and then set up the following request:

```jsx
useEffect(() => {
    const makeAsyncRequest = async () => {
        const userIdToken = await user.getIdToken();
        await axios.get(<your endpoint from the previous step>);
    };

    if (user) {
        makeAsyncRequest();
    }

}, [user]);
```

If this the above is successful, you should be able to see in the network tab of the dev tools that a request was made to your endpoint was made and that the payload contains all the information about the user that was gleaned from the token.

Congrats! You have a full stack authenticated application.