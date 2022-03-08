import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Navbar from "./components/Navbar";

function App() {
  //we import this variable which is true if there is an user logged in otherwise it returns null. we can use it to perform some conditional rendering. we need user to perform some conditional rendering, we don t want that when the user is logged in it can do another log in. We have to make it disappeared.
  const { authIsReady, user } = useAuthContext();
  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route exact path="/">
              {!user && <Redirect to="/login" />}
              {
                user && <Home /> //So now if we have value for user, there isn't no. It means you use is logged in and we show them the home page.
              }
            </Route>
            <Route path="/login">
              {
                user && (
                  <Redirect to="/" />
                ) /*if there is a user redirect to home page*/
              }
              {!user && <Login /> /*if there is not a user show log in*/}
            </Route>
            <Route path="/signup">
              {!user && <Signup />}
              {user && <Redirect to="/" />}
            </Route>
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
