import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";

export default function useShapes() {
  const [shapes, setShapes] = useState([]);
  const collectionRef = useRef(collection(db, "GeoFencing"));

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collectionRef.current, (querySnapshot) => {
        const shapesData = [];
        querySnapshot.forEach((doc) => {
          shapesData.push({ _id: doc.id, ...doc.data() });
        });
        setShapes(shapesData);
      });
      return () => unsubscribe();
    } catch (e) {
      console.log(e.error);
    }
  }, []);

  return shapes;
}
