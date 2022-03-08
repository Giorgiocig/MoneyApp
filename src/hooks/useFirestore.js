// this hook have to do 2 things: 1) add stuffs to the database 2)delete stuffs

import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";
//And then we'll create the var outside of the hook and we're creating it outside of the hop because we don't need to make a new copy of it every time the hook is used. the same is for the fn

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { success: false, isPending: true, error: null, document: null };
    case "ERROR":
      return {
        success: false,
        isPending: false,
        error: action.payload,
        document: null,
      };
    case "ADDED_DOCUMENT":
      return {
        success: true,
        isPending: false,
        error: null,
        document: action.payload,
      };
    case "DELETED_DOCUMENT":
      return {
        success: true,
        isPending: false,
        error: null,
        document: null,
      };
    default:
      return state;
  }
};

export const useFirestore = (collection) => {
  //So this response right here, this is the state that we're going to basically say represents the response that we get back from Firestorm when we make some kind of request. It's not going to be the exact response we get back, but it's going to be our own custom state object, which kind of represents that response.
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // collection ref
  const ref = projectFirestore.collection(collection);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const createdAt = timestamp.fromDate(new Date()); //it creates a date corresponding to the item creation
      const addedDocument = await ref.add({ ...doc, createdAt });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });
    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({
        type: "DELETED_DOCUMENT",
        payload: deleteDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR" });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, response };
};
