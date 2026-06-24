import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getDocument = async (collection, id) => {
  const ref = doc(db, collection, id);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};
