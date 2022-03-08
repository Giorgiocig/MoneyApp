import { useState, useEffect } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false); //in the cleaning fn is gonna be set on true

  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName) => {
    //email password and displayName coming from the form

    //the user makes mistakes into filling the sign up form(mispelling characters ecc), the signup fn is called and it returns an error because the auth is not recognized and now the state for error is not null anymore. We want the user refilling again the form. the user refills and he clicks on submit. but now the state for the error is still not null-->we get an error coming from the previous submit. to avoid it we have setError to null each time this function is called
    setError(null);
    setIsPending(true);

    try {
      //sign up user. we are calling the project Auth method and we are calling its method (very long) to sign up user.So this reaches out to Firebase Auth and it tries to sign that user up with an email and a password.Now it does send a response we can grab the response inside a var
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!res) {
        throw new Error("Could not complete signup");
      }
      //add display name to user. the logic wrote before doesn't allow us to put in the display name.What we have to do is we have to create the user first of all, then we have to update the profile of that user and set the display name property. there is an  update profile method that we can use.And this takes in an object as an argument.So now what we're saying is, look, take our use that it's just signed up and update their profile so that they now have a display name which matches whatever we take in as an argument right here. That's what a user signed up with in the form that value.

      // add display name to user
      await res.user.updateProfile({ displayName }); //is a long version of ({displayName}). Becasue displayName match with displayName passed as an input in the async func

      //DISPATCH LOGIN ACTION
      dispatch({ type: "LOGIN", payload: res.user });

      //update state--> we need it for cleaning up side effect
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      //we need it for cleaning up side effect
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  //So anytime we're using a hook like this, which is going to update states in a component, then we should use a cleanup function just in case that component that's using the hook on mounts.

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
};
