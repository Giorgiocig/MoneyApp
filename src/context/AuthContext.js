import { createContext, useEffect, useReducer } from "react";
import { projectAuth } from "../firebase/config";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    //So what we're doing is when we in the future dispatch a logging action whereby the type of the action is going to be logging, we're turning a new object to represent our state. We take the current state and spread those properties and then we say, update the user property, so...
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
    //So you can kind of see here that we're mirroring what Firebase does when Firebase signs in a user. Then we update our global ofstate so that we have that user as well.And then when Firebase logs out a user, then we update our global all state so that the user becomes null. So these things are kind of mirroring what Firebase is doing. And that's the aim we want to have state, which is correct if he uses logged in, according to Firebase. And now we're giving our entire application, this use object that we can use when they're locked in and when they're not logged in, we don't have that use object.
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    //So when we first load the application in a browser, we're going to perform a check inside this component to check if a user is logged in or not.We're going to say, basically, look, we don't want to show any of the component trait until all of these ready is true. So when we first load the application in a browser, we're going to perform a check inside this component. And that check is going to communicate with Firebase basically to say, Look, do we have a user currently. And Firebase is either going to say yes or no. auth is ready is gonna be firebase response

    authIsReady: false,
  });
  //So when this component is first evaluated, I want to fire some code to perform that check with Firebase. with useEffect we can do it given that without dependecy it fires once.

  useEffect(() => {
    //So this function right here is going to communicate with Firebase and say, Look, I want you to tell me whenever there's some kind of change in authentication status and when there is, I want you to fire this function and inside this function, we take in the user. BUT.. this function is going to fire every time there is some kind of authentication state change.So if in the future, after we perform this initial check, a user logs in or out. We're also going to fire this function. Then we're going to dispatch this all these ready function then as well. And we don't need to do that anymore. We want to fire it only once.

    const unsub = projectAuth.onAuthStateChanged((user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user }); //so we can update the user state that we initialized to null
      unsub(); //this declaration is to fire theh fn only once So that means for every authentication change in the future, once we unsubscribe, it no longer fire this function.;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
//Now the reason I'm doing that is so that later on, when we create some custom hooks to control, signing up, logging in, logging out and all that jazz, then we can use the dispatch method off function inside those hooks directly to update our context value.
