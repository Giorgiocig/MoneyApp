import { useEffect, useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  //state for cleaning up
  const [isCancelled, setIsCancelled] = useState(false); //in the cleaning fn is gonna be set on true
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  //So next up, we want to create a lock out function because we don't automatically want to lock the user out when they use this hook inside a component. We might want to use this hook in a component and then only lock the user route in that component when they click on a button.

  const logout = async function () {
    setError(null);
    setIsPending(true);

    try {
      await projectAuth.signOut(); //signOut is a amethod coming from Auth

      //DISPATCH LOGOUT ACTION
      dispatch({ type: "LOGOUT" });

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

  return { logout, error, isPending };
};
