//this hook will fetch the collection of transaction from the database

import { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  const query = useRef(_query).current; //this line is to avoid an infinite loop. useRef is to break an infinite loop when a reference type is used as a dependency. Indeed, the 3 args for where are are wrapped into one array declared in Home.js. array is an referenced type that we are actually using as a dependency and for that reason it will trigger an infinite loop.

  const orderBy = useRef(_orderBy).current;

  useEffect(() => {
    let ref = projectFirestore.collection(collection);
    // snapshot represents the collection at that moment in time when we first connect to that collection and it's going to contain all the documents on it, and thereafter it will find this function again whenever the file store collection changes.

    if (query) {
      ref = ref.where(...query); //spreaded array from Home.js. ref=ref.where(...) is equal to write                           let ref = projectFirestore.collection(collection).where(...query);
    }

    if (orderBy) {
      ref = ref.orderBy(...orderBy); //inputs are declared in home.js. we are ordering data based on the timestamp/creation date
    }

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        let results = [];
        //And remember, snapshot.docs represents an array of documents from that snapshot.
        snapshot.docs.forEach((doc) => {
          console.log(doc);
          results.push({ ...doc.data(), id: doc.id }); //Remember, this is the function we used to get the data from a document. So in our case, that would include the name property, the amount property, the created up property and the UID property. Then we have id that mustn t be confused with UID. UID is for user, id is for every item in the collection

          //SUMMARY But all we're doing is creating a new document or new object for each document that we have, right?  And we're pushing up to. The results are right right here.   And each of those objects will have all of the data from that document and an ID property, which is  coming from the document itself.
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        //it is a second argument from onSnapshot function
        console.log(error);
        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [collection, query, orderBy]); //it is gonna be fire when there is a chenge in collection

  return { documents, error };
};
