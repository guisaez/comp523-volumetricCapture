/**
 * Components: User
 * This component represents the user authentication flow, it decides whether to render the login or signup view.
 * Props:
 * setTabValue : a function to set the value of the current tab in the main navigation bar
 * setisLogged : a function to set the logged-in status of the user
 * States:
 * view : a string to determine the current view of the component (login or signup)
 * Child components:
 * Login : a child component for user login
 * Signup : a child component for user signup
 */
import * as React from "react";
import Login from "./Login";
import Signup from "./Signup";

// Functional component for the User interface
function User({ setTabValue, setisLogged, ...props }) {
  // State variables to control the current view
  const [view, setView] = React.useState("login");

  // Render the appropriate component based on the current view
  return (
    <div>
      {view === "login" && (
        <Login
          setView={setView}
          setTabValue={setTabValue}
          setisLogged={setisLogged}
        />
      )}
      {view === "signup" && <Signup setView={setView} />}
    </div>
  );
}

export default User;
