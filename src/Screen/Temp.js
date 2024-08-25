import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import React from "react";
import { db } from "../firebase";

function Temp() {
  //   const sendValue = async () => {
  //     const collectionRef = collection(db, "GeoFencing");
  //     try {
  //       const querySnapShot = await getDocs(collectionRef);
  //       console.log(querySnapShot);
  //       querySnapShot.forEach((doc) => {
  //         console.log(doc.data());
  //       });

  //       // Corrected: Use doc() to create a new document reference
  //       //   const newDocRef = doc(collectionRef);

  //       //   await setDoc(newDocRef, { message: "Hello" })
  //       //     .then(() => {
  //       //       console.log("Done");
  //       //     })
  //       //     .catch((e) => {
  //       //       console.log(e);
  //       //     });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   sendValue();
  const listenForUpdates = () => {
    const collectionRef = collection(db, "GeoFencing");

    // Set up a real-time listener
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        // Handle the updated data as needed in your frontend
      });
    });

    // To stop listening for updates, call the unsubscribe function
    // when your component unmounts or when you no longer need updates.
    // For example, you can call this function when the component is about to be unmounted.
    // unsubscribe();
  };

  // Call the function to start listening for updates
  listenForUpdates();
  return <div>Temp</div>;
}

export default Temp;

// [
//   { lat: 18.84728193133834, lng: 83.02086466232038 },
//   { lat: 18.84741431201716, lng: 83.0211219793774 },
//   { lat: 18.847637690628638, lng: 83.02118098797573 },
//   { lat: 18.847759533382334, lng: 83.02120244564784 },
//   { lat: 18.848008295396482, lng: 83.02118635239376 },
//   { lat: 18.848206289389132, lng: 83.02118635239376 },
//   { lat: 18.848404283148227, lng: 83.02118635239376 },
//   { lat: 18.848551509125375, lng: 83.02118098797573 },
//   { lat: 18.84872919547754, lng: 83.0211756235577 },
//   { lat: 18.848906881641575, lng: 83.02115416588558 },
//   { lat: 18.849074414138233, lng: 83.02115416588558 },
//   { lat: 18.84935871132564, lng: 83.0211219793774 },
//   { lat: 18.84948562955739, lng: 83.0211219793774 },
//   { lat: 18.84971408213266, lng: 83.0211219793774 },
//   { lat: 18.849830846662154, lng: 83.02110588612331 },
//   { lat: 18.849922227541608, lng: 83.02110588612331 },
//   { lat: 18.850064375477427, lng: 83.02110588612331 },
//   { lat: 18.850140526107808, lng: 83.02111661495937 },
//   { lat: 18.85046543507584, lng: 83.0210683351971 },
//   { lat: 18.850617735938073, lng: 83.0210683351971 },
//   { lat: 18.850836033599567, lng: 83.0210683351971 },
//   { lat: 18.850942643982194, lng: 83.0210683351971 },
//   { lat: 18.85102894757569, lng: 83.02106297077907 },
//   { lat: 18.851272201882708, lng: 83.02105754913498 },
//   { lat: 18.85189134178982, lng: 83.02103338064082 },
//   { lat: 18.85232275032755, lng: 83.02101056755767 },
//   { lat: 18.852784617524197, lng: 83.02099848331059 },
//   { lat: 18.85311946151635, lng: 83.02098236144346 },
//   { lat: 18.853626909399345, lng: 83.0209769684124 },
//   { lat: 18.85409374304906, lng: 83.02094475329119 },
//   { lat: 18.854586064811947, lng: 83.02089914143146 },
//   { lat: 18.854823710054617, lng: 83.02082961332111 },
//   { lat: 18.85504251762437, lng: 83.02079410021717 },
//   { lat: 18.855393315224788, lng: 83.02069421409684 },
//   { lat: 18.855739550931464, lng: 83.02061245905291 },
//   { lat: 18.85623911243701, lng: 83.02049186430928 },
//   { lat: 18.856694091866892, lng: 83.0203206215804 },
//   { lat: 18.85741114060842, lng: 83.01994594961447 },
//   { lat: 18.858083760543945, lng: 83.01962575912502 },
//   { lat: 18.858454315605044, lng: 83.0194359892606 },
//   { lat: 18.85871316138983, lng: 83.01928175508897 },
// ];
