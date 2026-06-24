import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getUserRole = async (pageId, userId) => {
  const q = query(
    collection(db, "permissions"),
    where("pageId", "==", pageId),
    where("userId", "==", userId)
  );

  const snap = await getDocs(q);
  return snap.empty ? "viewer" : snap.docs[0].data().role;
};
