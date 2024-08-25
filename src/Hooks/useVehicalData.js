import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";

// Custom Hook: useVehicalData
export default function useVehicalData() {
  const [vehicalData, setVehicalData] = useState({});
  const database = getDatabase();
  const vehicalRef = useRef(ref(database, "SIH"));

  useEffect(() => {
    const unsubscribe = onValue(vehicalRef.current, (snapshot) => {
      const data = snapshot.val();

      // Check if data is different to avoid re-render loop
      if (JSON.stringify(data) !== JSON.stringify(vehicalData)) {
        setVehicalData(data || {});
      }
    });

    return () => unsubscribe();
  }, [vehicalData]); // Include vehicalData in the dependency array

  return vehicalData;
}
