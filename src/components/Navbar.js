import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

// styles
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext(); //to get access to user obj

  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={styles.title}>myMoney</li>

        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
          //So what we're saying here is, look, if we don't have a user that's locked in, if this is no, then I want to return some template. And that template is this thing right here, which is a fragment, because remember, when we're using a template like this, we have to have one element. And if that didn't exist, these two things would get an error because now we have two elements.
        )}

        {user && (
          <>
            <li>hello, {user.displayName}</li>
            <li>
              <button className="btn" onClick={logout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

//we want to change the button depending whether the user is logged in or not. To do it we need to get access to user obj where there is property displaying if the user is logged in or not. to get access we import the useAuthContext which returns the context
