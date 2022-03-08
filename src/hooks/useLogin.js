import { useEffect, useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  //state for cleaning up
  const [isCancelled, setIsCancelled] = useState(false); //in the cleaning fn is gonna be set on true
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  //So next up, we want to create a lock out function because we don't automatically want to lock the user out when they use this hook inside a component. We might want to use this hook in a component and then only lock the user route in that component when they click on a button.

  const login = async function (email, password) {
    setError(null);
    setIsPending(true);

    try {
      const res = await projectAuth.signInWithEmailAndPassword(email, password); //signin is a amethod coming from Auth. It takes 2 args, email and pass. the method returns a response that we stored in a variable. in the res obj is going to be an obj containing an USER.now that user, it's going to be the payload  of this action.

      //DISPATCH LOGOUT ACTION
      dispatch({ type: "LOGIN", payload: res.user });

      //update state
      //we need it for cleaning up side effect

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }

      setIsPending(false);
      setError(null);
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

  return { login, error, isPending };
};
