import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const createPage = async (ownerId) => {
  const ref = await addDoc(collection(db, "pages"), {
    title: "Untitled Page",
    content: "",
    ownerId,
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const subscribeToPage = (pageId, callback) => {
  return onSnapshot(doc(db, "pages", pageId), callback);
};

export const updatePageContent = async (pageId, content) => {
  await updateDoc(doc(db, "pages", pageId), {
    content,
    updatedAt: serverTimestamp(),
  });
};
