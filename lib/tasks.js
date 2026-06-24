import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

export const createTask = async (pageId, title, dueDate) => {
  await addDoc(collection(db, "tasks"), {
    pageId,
    title,
    dueDate,
    status: "pending",
  });
};

export const getTasksByPage = async (pageId) => {
  const q = query(collection(db, "tasks"), where("pageId", "==", pageId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateTaskStatus = async (taskId, status) => {
  await updateDoc(doc(db, "tasks", taskId), { status });
};
