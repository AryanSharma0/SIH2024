/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  GoogleMap,
  useLoadScript,
  Polygon,
  Polyline,
  Marker,
  DirectionsRenderer,
  DirectionsService,
  InfoWindow,
} from "@react-google-maps/api";
import { FaMapMarker } from "react-icons/fa";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Weather from "../Component/Weather";
import WeatherData from "../Component/WeatherData";
import { FaLocationDot } from "react-icons/fa6";
import { useSpeechSynthesis } from "react-speech-kit";
import Graph from "../Component/Graph";
import Webcam from "react-webcam";
import Camera from "./Camera";

const TempDriver = () => {
  const [graph, setGraph] = useState(new Graph());
  const [shortestPath, setShortestPath] = useState([]);
  const [shape, setShape] = useState([]);
  const [clickedCoordinates, setClickedCoordinates] = useState(null);
  const [vehicalData, setVehicalData] = useState({});
  const [destination, setDestination] = useState({ lat: 0, lng: 0 });
  const [chooseOption, setChooseOption] = useState(null);
  const [initialCoordinate, setInitialCoordinate] = useState({
    lat: 18.85268874827404,
    lng: 83.02237719767375,
  });
  const [alert, setAlert] = useState("");
  const [mapZoom, setMapZoom] = useState(15);

  const [travelMode, setTravelMode] = useState("DRIVING");
  const [response, setResponse] = useState(null);
  const CustomMarker = require("../Asset/Truck.png");
  const [openshapeHint, setOpenShapeHint] = useState(false);
  const [clickedShape, setClickedShape] = useState(false);
  const [clickedShapeData, setClickedShapeData] = useState({});
  const [openDirection, setOpenDirection] = useState(false);
  const [tempcount, setTempcount] = useState();
  const database = getDatabase();
  const [navigatePolyline, setNavigatePolyline] = useState(false);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [selectedPolyline, setSelectedPolyline] = useState({});

  // All the refs
  const mapTempRef = useRef();
  const mapRef = useRef();
  const vehicalRef = ref(database, "SIH");

  // fOR GETTING SHAPES FROM BACKEND
  const collectionRef = collection(db, "GeoFencing");

  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const shapesData = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));
      setShape(shapesData);
    });

    return () => unsubscribe(); // Cleanup function
  }, []);
  const dataArrays = shape.filter((data) => data.type === "polyline");

  const handleMarkerClick = () => {
    setInfoWindowOpen(!infoWindowOpen);
  };

  const addNodesAndEdges = (dataArray, graph) => {
    dataArray.path.forEach(({ lat, lng }) => {
      graph.addNode(lat, lng);
    });

    const path = dataArray.path.map(({ lat, lng }) => ({ lat, lng }));
    graph.polylines.push(dataArray);

    for (let i = 0; i < dataArray.length - 1; i++) {
      const currentNode = graph.getNodeId(dataArray[i].lat, dataArray[i].lng);
      const nextNode = graph.getNodeId(
        dataArray[i + 1].lat,
        dataArray[i + 1].lng
      );
      graph.addEdge(currentNode, nextNode);
    }
  };

  useEffect(() => {
    // Add data arrays to the graph when component mounts
    dataArrays.forEach((data) => addNodesAndEdges(data, graph));
    setGraph(graph);
  }, [dataArrays, graph]);

  const calculateShortestPath = () => {
    // For simplicity, assuming start and target nodes are the first nodes of the first and last arrays
    if (dataArrays.length !== 0) {
      const startNode = graph.getNodeId(
        dataArrays[1].path[1].lat,
        dataArrays[1].path[1].lng
      );
      const targetNode = graph.getNodeId(
        // dataArrays[dataArrays.length - 1][
        //   dataArrays[dataArrays.length - 1].length - 1
        // ].lat,
        // dataArrays[dataArrays.length - 1][
        //   dataArrays[dataArrays.length - 1].length - 1
        // ].lng
        dataArrays[1].path[3].lat,
        dataArrays[1].path[3].lng
      );
      console.log(startNode, targetNode);
      const shortestPath = graph.getShortestPath(startNode, targetNode);

      // Render the shortest path on the map (Polyline or some visual indicator)
      const path = shortestPath.map((nodeId) => {
        const { lat, lng } = graph.nodes[nodeId];
        return { lat, lng };
      });
      console.log(path);
      setShortestPath(path);
    }
  };

  useEffect(() => {
    if (tempcount === 0) {
      speaks("Welcome ");
    }
    setTempcount((prev) => prev + 1);
  });

  useEffect(() => {
    const unsubscribe = onValue(vehicalRef, (snapshot) => {
      const data = snapshot.val();
      // Current location of vehical
      // console.log("data", data);

      setVehicalData(data); // Guard against null data
      // setInitialCoordinate({ lat: data.lat, lng: data.lng });
      setAlert(data.accident);
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  const [vehicle2Path, setVehicle2Path] = useState([
    { lng: 83.0211573308103, lat: 18.852254518152055 },

    { lng: 83.02123243266271, lat: 18.853361222804566 },

    { lng: 83.0212109749906, lat: 18.855564457124483 },

    { lat: 18.856701599001656, lng: 83.02186543399023 },

    { lng: 83.02284175807165, lat: 18.85740215578538 },

    { lng: 83.024055119977, lat: 18.85787857280607 },

    { lng: 83.0248812403536, lat: 18.858183160934477 },

    { lng: 83.0257824625826, lat: 18.85915783922884 },

    { lng: 83.02658935386339, lat: 18.85993357543005 },

    { lng: 83.0271687110106, lat: 18.860837174193865 },

    { lng: 83.02775879699388, lat: 18.86173730354277 },

    { lat: 18.86249875530874, lng: 83.02815576392808 },

    { lng: 83.02869635053808, lat: 18.863296396013997 },

    { lat: 18.864098450987115, lng: 83.0294366402262 },

    { lat: 18.86470760409973, lng: 83.03014474340613 },

    { lng: 83.0310542280066, lat: 18.865810725649155 },

    { lat: 18.866348805517976, lng: 83.03154775446534 },

    { lng: 83.03189107721924, lat: 18.866734597568577 },

    { lng: 83.0324060613501, lat: 18.867343741104303 },

    { lat: 18.867912273074218, lng: 83.0328566724646 },

    { lat: 18.868571727452988, lng: 83.03340535215511 },

    { lat: 18.86903873257758, lng: 83.03384523443356 },

    { lat: 18.869526040885805, lng: 83.03422074369564 },

    { lng: 83.03456406644955, lat: 18.87004380441116 },

    { lat: 18.870378827016573, lng: 83.03482155851498 },

    { lat: 18.870713848952423, lng: 83.03517561010494 },

    { lat: 18.871191000250576, lng: 83.03544383100643 },

    { lng: 83.03585700039953, lat: 18.871916980082673 },

    { lat: 18.872589123095334, lng: 83.03637437617468 },

    { lat: 18.873465769952563, lng: 83.03686338071685 },

    { lng: 83.03723888997894, lat: 18.874085040994515 },

    { lat: 18.874623094304333, lng: 83.03758221273284 },

    { lng: 83.03794699315887, lat: 18.875211905380795 },

    { lng: 83.03835468892913, lat: 18.875739803207743 },

    { lat: 18.87635906584668, lng: 83.03878384237152 },

    { lng: 83.03927736883026, lat: 18.877130602981957 },

    { lng: 83.03963142042022, lat: 18.877678798261414 },

    { lat: 18.878348812278478, lng: 83.04003911619048 },

    { lng: 83.04025369291168, lat: 18.878714273340343 },

    { lng: 83.04043608312469, lat: 18.879242160133515 },

    { lat: 18.880013683993244, lng: 83.04075794820648 },

    { lat: 18.88036898983905, lng: 83.04099398259979 },

    { lat: 18.880795355859362, lng: 83.04124074582916 },

    { lng: 83.041573339747, lat: 18.88150596348187 },

    { lng: 83.04170208577972, lat: 18.881749599687126 },

    { lng: 83.04216342573028, lat: 18.882602323615107 },

    { lat: 18.883979115148488, lng: 83.04295468221862 },

    { lng: 83.04334092031677, lat: 18.885187123353205 },

    { lng: 83.04396319280822, lat: 18.88612103969107 },

    { lng: 83.04483222852905, lat: 18.8873188812836 },

    { lat: 18.88857762084354, lng: 83.04583001028259 },

    { lng: 83.04648446928222, lat: 18.889501367242868 },

    { lat: 18.890313447780343, lng: 83.04693508039672 },

    { lng: 83.04765776162517, lat: 18.891546826164703 },

    { lat: 18.89214572862585, lng: 83.04800108437908 },

    { lng: 83.04831222062481, lat: 18.892876589743736 },

    { lat: 18.89360744767102, lng: 83.04874137406719 },

    { lat: 18.894369747986524, lng: 83.04909421579531 },

    { lng: 83.04929806368044, lat: 18.894958489648804 },
  ]);
  const [vehical3Data, setVehical3Data] = useState({ lat: 0.0, lng: 0.0 });

  const [vehical2Data, setVehical2Data] = useState({ lat: 0.0, lng: 0.0 });
  const [count, setCount] = useState(0);

  // console.log(count);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log(vehicle2Path[count], vehicle2Path.length, count);
      setVehical2Data({
        lat: vehicle2Path[count].lat,
        lng: vehicle2Path[count].lng,
      });
      if (count === vehicle2Path.length - 1) {
        setCount(0);
      } else {
        setCount((prev) => prev + 1);
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    }; // Cleanup interval on component unmount
  }, [count]);
  const [vehical2Count, setVehical2Count] = useState(vehicle2Path.length - 1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log(vehicle2Path[count], vehicle2Path.length, count);
      setVehical3Data({
        lat: vehicle2Path[vehical2Count].lat,
        lng: vehicle2Path[vehical2Count].lng,
      });
      if (count === 0) {
        setVehical2Count(vehicle2Path.length - 1);
      } else {
        setVehical2Count((prev) => prev - 1);
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    }; // Cleanup interval on component unmount
  }, [count]);

  // For backend

  // fOR GETTING SHAPES FROM BACKEND
  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const shapesData = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));
      setShape(shapesData);
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  // ON MAP LOAD
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // On Clicking on any map location
  const handleMapClick = useCallback(
    (event) => {
      const clickedLat = event.latLng.lat();
      const clickedLng = event.latLng.lng();
      setClickedCoordinates({ lat: clickedLat, lng: clickedLng });
      if (chooseOption === "directions") {
        setDestination({ lat: clickedLat, lng: clickedLng });
      }
    },
    [chooseOption]
  );

  const markSomePoint = () => {
    if (chooseOption !== null) {
      setChooseOption(null);
      setDestination(null);
    } else {
      setChooseOption("directions");
    }
  };

  // DIRECTION API
  const [directionsTimeout, setDirectionsTimeout] = useState(null);

  const directionsCallback = (result, status) => {
    if (status === "OK") {
      setResponse(result);
    } else {
      // console.error(`Directions request failed due to ${status}`);
    }
  };

  useEffect(() => {
    const clearDirectionsTimeout = () => {
      if (directionsTimeout) {
        clearTimeout(directionsTimeout);
        setDirectionsTimeout(null);
      }
    };

    // Clear timeout on unmount or when destination changes
    return clearDirectionsTimeout;
  }, [directionsTimeout, setDirectionsTimeout, destination]);

  useEffect(() => {
    // Request directions only if destination is set
    if (destination) {
      // console.log(datapoint);
      // Set a timeout to delay the directions request
      const timeoutId = setTimeout(() => {
        const directionsOptions = {
          destination: destination,
          origin: {
            lat: vehicalData.lat || 0,
            lng: vehicalData.lng || 0,
          },
          // waypoints: datapoint.map((data) => {
          //   return { location: data };
          // }),
          travelMode: travelMode,
          provideRouteAlternatives: true,
        };

        // Directions Service
        setResponse(null); // Clear previous response
        const directionsService =
          window.google && new window.google.maps.DirectionsService();
        directionsService &&
          directionsService.route(directionsOptions, (result, status) =>
            directionsCallback(result, status)
          );
      }, 1000); // 1 second delay

      // Save the timeout ID for cleanup
      setDirectionsTimeout(timeoutId);
    }
  }, [destination, vehicalData.lat, vehicalData.lng, travelMode]);

  const moveVehicleToThisPath = async (polyline) => {
    let tempArr = polyline.path;
    let count = 0;

    try {
      const pathDBRef = ref(database, `SIH`);
      const collectionRef = collection(db, "GeoFencing");

      const docRef = doc(collectionRef, polyline._id);

      if (!polyline.visited_vehicle) {
        // If _id doesn't exist in vehicalData, add it with a default value of 0
        await updateDoc(docRef, {
          visited_vehicle: 1,
        });
      } else {
        // Increment the value of the _id in the database
        await updateDoc(docRef, {
          visited_vehicle: polyline.visited_vehicle + 1,
        });
      }

      const intervalId = setInterval(() => {
        if (count < tempArr.length) {
          const pathUpdate = {};

          console.log(tempArr[count]);
          if (
            !tempArr[count].instruction
            // tempArr[count].instruction === "Move Straight"
          ) {
            setVehicalData((prevData) => ({
              ...prevData,
              lat: tempArr[count].lat,
              lng: tempArr[count].lng,
            }));

            pathUpdate.lat = tempArr[count].lat;
            pathUpdate.lng = tempArr[count].lng;
            pathUpdate.instruction = null;
          } else {
            setVehicalData((prevData) => ({
              ...prevData,
              lat: tempArr[count].lat,
              lng: tempArr[count].lng,
              instruction: tempArr[count].instruction,
            }));

            pathUpdate.lat = tempArr[count].lat;
            pathUpdate.lng = tempArr[count].lng;
            pathUpdate.Alert = tempArr[count].instruction;
          }
          console.log(vehicalData);

          update(pathDBRef, pathUpdate);

          setInitialCoordinate({
            lat: tempArr[count].lat,
            lng: tempArr[count].lng,
          });
          count++;
        } else {
          // Stop the interval when the loop is completed
          clearInterval(intervalId);
        }
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const moveCameraTogivenLocation = (polyline) => {
    console.log(polyline);
    // setInitialCoordinate(polyline.path[0]);
    setMapZoom(14);
  };
  const onMapZoom = useCallback(() => {
    mapRef.current && setMapZoom(mapRef.current.data.map.zoom);
  }, []);

  const onShapeClick = (shape) => {
    console.log(shape);
    if (shape.type === "marker") {
      setInitialCoordinate(shape.path);
    } else {
      // setInitialCoordinate(shape.path[0]);
    }
    setMapZoom(16);
    setClickedShape(true);
    setClickedShapeData(shape);
  };

  useEffect(() => {
    if (vehicalData.Alert) {
      setOpenDirection(true);
      console.log(vehicalData.Alert);

      vehicalData.Alert && speaks(vehicalData.Alert);
      const timeId = setTimeout(() => {
        setOpenDirection(false);
      }, 2000);

      return () => timeId;
    }
  }, [vehicalData.Alert]);

  const [openAccident, setOpenAccident] = useState();
  // For alert Sending
  useEffect(() => {
    if (alert) {
      setOpenAccident(true);
      console.log(alert);

      alert && speaks(alert);
      const timeId = setTimeout(() => {
        setOpenAccident(false);
      }, 2000);

      return () => timeId;
    }
  }, [alert]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY, // Replace with your actual API key
  });

  const speaks = (text) => {
    speak({ text: text });
  };
  const onPolylineClicked = (e, data) => {
    setSelectedPolyline(data);
    moveCameraTogivenLocation(data);
    setClickedCoordinates({ lat: e.latLng.lat(), lng: e.latLng.lat() });
  };
  // useEffect(() => {
  //   if (navigatePolyline && selectedPolyline) {
  //     onShapeClick(data);
  //     moveVehicleToThisPath(data);
  //   }
  // }, []);

  const { speak } = useSpeechSynthesis();
  const webRef = useRef(null);
  useEffect(() => {
    speaks(
      "React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It’s ‘V’ in MVC. ReactJS is an open-source, component-based front-end library responsible only for the view layer of the application. It is maintained by Facebook."
    );
  }, []);
  // Empty dependency array to run the effect only once on component mount.

  // useEffect()

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps...";

  return (
    <div className="flex h-screen w-screen">
      <div className="bg-[#ffffff] px-2 w-[30vw] h-screen overflow-y-scroll lg:w-[20vw]">
        <div className=" mt-2 h-26 justify-between py-2  flex-wrap bg-[#e7e7e7] px-2 shadow-md flex w-full">
          <button
            className="mr-2 p-2 border-2 bg-[#d1d1d1] hover:scale-105 active:scale-95 rounded-md shadow-md"
            onClick={markSomePoint}
            title="Add new Marker"
          >
            <FaMapMarker size={20} />
          </button>
          <button
            onClick={() => {
              setNavigatePolyline((prev) => !prev);
              moveVehicleToThisPath(selectedPolyline);
            }}
          >
            Navigate
          </button>

          <button onClick={() => speaks("Hey welcome")}>🎤 OnClick</button>
          <button onClick={calculateShortestPath}>🎤 Hey navigate</button>
        </div>

        <>
          <div className="my-3 bg-[#e7e7e7] rounded-md shadow-lg p-1">
            <h2 className="text-xl mb-2">Polygon List</h2>

            <ul className="h-[25vh] overflow-y-scroll">
              {shape.map(
                (shapes, index) =>
                  shapes.type === "polygon" && (
                    <li
                      key={index}
                      className={`mb-2 shadow-md border-2 rounded-lg cursor-pointer p-4 flex items-center ${
                        navigatePolyline ? "bg-[#e0e0e0]" : ""
                      }`}
                    >
                      <div
                        className="w-5 h-5 mr-2 "
                        style={{
                          backgroundColor: shapes.s_color,
                          border: "1px solid #ccc",
                        }}
                      ></div>
                      <span className=" truncate" title={shapes.s_name}>
                        {shapes.s_name}
                      </span>
                    </li>
                  )
              )}
            </ul>
          </div>

          <div className="mb-3 bg-[#e7e7e7] rounded-md shadow-lg p-1">
            <h2 className="text-xl mb-2">Polylines List</h2>
            {selectedPolyline.s_name &&
              selectedPolyline.type === "polyline" && (
                <div
                  onClick={() => {
                    moveCameraTogivenLocation(selectedPolyline);
                  }}
                  className={`mb-2 shadow-md border-2 rounded-lg cursor-pointer p-4 flex items-center ${
                    vehicalData._id === selectedPolyline._id && navigatePolyline
                      ? "bg-[#0fa6b9]"
                      : "bg-[#0fa6b9]"
                  }`}
                >
                  <div
                    className="w-5 h-5 mr-2 "
                    style={{
                      backgroundColor: selectedPolyline.s_color,
                      border: "1px solid #ccc",
                    }}
                  ></div>
                  <span className=" truncate" title={selectedPolyline.s_name}>
                    {selectedPolyline.s_name}
                  </span>
                </div>
              )}
            <ul className="h-[25vh] overflow-y-scroll">
              {shape.map(
                (shapes, index) =>
                  shapes.type === "polyline" && (
                    <li
                      key={index}
                      className={`mb-2 shadow-md border-2 rounded-lg cursor-pointer p-4 flex items-center ${
                        vehicalData._id === shapes._id ? "bg-[#e0e0e0]" : ""
                      }`}
                    >
                      <div
                        className="w-5 h-5 mr-2 "
                        style={{
                          backgroundColor: shapes.s_color,
                          border: "1px solid #ccc",
                        }}
                      ></div>

                      <span className=" truncate" title={shapes.s_name}>
                        {shapes.s_name}
                      </span>
                    </li>
                  )
              )}
            </ul>
          </div>

          <div className="mb-3 bg-[#e7e7e7] rounded-md shadow-lg p-1">
            <h2 className="text-xl mb-2">Marker List</h2>
            <ul className="h-[19vh] overflow-y-scroll">
              {shape.map(
                (shapes, index) =>
                  shapes.type === "marker" && (
                    <li
                      key={index}
                      className={`mb-2 shadow-md border-2 rounded-lg cursor-pointer p-4 flex items-center ${
                        vehicalData._id === index ? "bg-[#e0e0e0]" : ""
                      }`}
                    >
                      <FaLocationDot className="pr-1" size={18} />

                      <span className=" truncate" title={shapes.s_name}>
                        {shapes.s_name}
                      </span>
                    </li>
                  )
              )}
            </ul>
          </div>
        </>
      </div>
      <div className="h-screen w-[70vw] lg:w-[80vw] ">
        <div className=" h-[75vh] relative">
          <GoogleMap
            mapContainerClassName="h-full flex"
            center={initialCoordinate}
            zoom={mapZoom}
            onLoad={onMapLoad}
            ref={mapTempRef}
            onClick={handleMapClick}
            onZoomChanged={onMapZoom}
          >
            {shape.map((shapes, index) => {
              if (shapes.type === "polygon") {
                return (
                  <Polygon
                    key={index}
                    path={shapes.path}
                    onClick={() => onShapeClick(shapes)}
                    options={{
                      fillColor: shapes.s_color,
                      strokeColor: shapes.s_color,
                      fillOpacity: vehicalData._id === index ? 0.9 : 0.4,
                      strokeWeight: vehicalData._id === index ? 3 : 1,
                    }}
                  />
                );
              }

              if (shapes.type === "polyline") {
                // console.log(graph);
                return (
                  <Polyline
                    key={index}
                    geodesic={true}
                    path={shapes.path}
                    options={{
                      strokeColor: shapes.s_color,
                      strokeOpacity: 1,
                      strokeWeight:
                        mapRef.current && mapRef.current.data
                          ? mapRef.current.data.map.zoom / 3
                          : 4,
                    }}
                    onClick={() => {
                      onShapeClick(shapes);
                      moveVehicleToThisPath(shapes);
                    }}
                  />
                );
              }

              if (shapes.type === "marker") {
                return (
                  <Marker
                    // label={shapes.s_name}
                    title={shapes.s_name}
                    key={index}
                    position={shapes.path}
                    onClick={() => onShapeClick(shapes)}
                    options={{
                      icon: {
                        url: require("../Asset/warning-icon.webp"),
                        scaledSize: new window.google.maps.Size(
                          mapRef.current
                            ? mapRef.current.data.map.zoom * 2
                            : 60,
                          mapRef.current ? mapRef.current.data.map.zoom * 2 : 50
                        ),
                        // anchor: new window.google.maps.Point(20, 20),
                      },
                    }}
                  />
                );
              }

              return null;
            })}

            <Marker
              position={vehical3Data}
              options={{
                icon: {
                  url: require("../Asset/otherTruck.png"),
                  scaledSize: new window.google.maps.Size(
                    mapRef.current ? mapRef.current.data.map.zoom * 2 : 60,
                    mapRef.current ? mapRef.current.data.map.zoom * 2 : 50
                  ),
                  // anchor: new window.google.maps.Point(20, 20),
                },
              }}
              onClick={handleMarkerClick}
            >
              {infoWindowOpen && (
                <InfoWindow onCloseClick={() => setInfoWindowOpen(false)}>
                  <div>
                    <h1>UP22XY0002</h1>
                    <p>{"20Km/hr"}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
            <Marker
              position={{ lat: 17.406299421503043, lng: 78.62082588594289 }}
              options={{
                icon: {
                  url: require("../Asset/otherTruck.png"),
                  scaledSize: new window.google.maps.Size(
                    mapRef.current ? mapRef.current.data.map.zoom * 2 : 60,
                    mapRef.current ? mapRef.current.data.map.zoom * 2 : 50
                  ),
                  // anchor: new window.google.maps.Point(20, 20),
                },
              }}
              onClick={handleMarkerClick}
            >
              {infoWindowOpen && (
                <InfoWindow onCloseClick={() => setInfoWindowOpen(false)}>
                  <div>
                    <h1>UP22XY0003</h1>
                    <p>{"0Km/hr"}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
            <Marker
              position={vehical2Data}
              options={{
                icon: {
                  url: require("../Asset/otherTruck.png"),
                  scaledSize: new window.google.maps.Size(
                    mapRef.current ? mapRef.current.data.map.zoom * 2 : 60,
                    mapRef.current ? mapRef.current.data.map.zoom * 2 : 50
                  ),
                  // anchor: new window.google.maps.Point(20, 20),
                },
              }}
              onClick={handleMarkerClick}
            >
              {infoWindowOpen && (
                <InfoWindow onCloseClick={() => setInfoWindowOpen(false)}>
                  <div>
                    <p>{"20Km/hr"}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
            {graph.polylines.map((data, index) => (
              <Polyline
                key={index}
                path={data.path}
                geodesic={true}
                options={{
                  strokeColor:
                    data._id === selectedPolyline._id
                      ? "#009407"
                      : data.s_color,
                  strokeOpacity: 1,
                  strokeWeight: mapRef.current?.data
                    ? mapRef.current.data.map.zoom / 3
                    : 4,
                }}
                onClick={(e) => {
                  onPolylineClicked(e, data);
                }}
              />
            ))}
            {shortestPath.length > 0 && (
              <Polyline
                path={shortestPath}
                options={{
                  strokeColor: "#FF0000", // Set your desired color for the shortest path
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
            )}
            <Marker position={clickedCoordinates} />
            <Marker
              position={{ lat: vehicalData.lat, lng: vehicalData.lng }}
              options={{
                icon: {
                  url: require("../Asset/Truck.png"),
                  scaledSize: new window.google.maps.Size(
                    mapRef.current ? mapRef.current.data.map.zoom * 4 : 60,
                    mapRef.current ? mapRef.current.data.map.zoom * 3 : 50
                  ),
                  anchor: new window.google.maps.Point(20, 20),
                },
                title: "UP22XY0001",
                visible: true,
                clickable: true,
              }}
              onClick={() => {
                // console.log("sdfasd");
              }}
              className="h-10"
            >
              {infoWindowOpen && (
                <InfoWindow onCloseClick={() => setInfoWindowOpen(false)}>
                  <div>
                    <h1>UP22XY0001</h1>
                    <p>{"20Km/hr"}</p>
                  </div>
                </InfoWindow>
              )}
              {/* <img src={CustomMarker} className="h-40 w-40" alt="" /> */}
            </Marker>
            {console.log(vehicalData)}

            {chooseOption === ("directions" || "navigate") && (
              <Marker position={destination} />
            )}
            {response && destination && (
              <DirectionsRenderer
                options={{ directions: response, preserveViewport: true }}
              />
            )}
          </GoogleMap>
          <div
            className={`bg-white  ${openshapeHint ? `h-full` : `h-28`} max-h-${
              openshapeHint ? 80 : 28
            } w-50 absolute shadow-xl rounded-lg bottom-2 left-2`}
          >
            {openshapeHint ? (
              <RiArrowDropDownLine
                onClick={() => setOpenShapeHint((prev) => !prev)}
                size={28}
                className="flex cursor-pointer w-full justify-end items-end"
              />
            ) : (
              <RiArrowDropUpLine
                onClick={() => setOpenShapeHint((prev) => !prev)}
                size={28}
                className="flex cursor-pointer w-full justify-end items-end"
              />
            )}
            <div
              className={`overflow-y-scroll max-h-72 ${
                openshapeHint ? "h-full" : "20"
              }`}
            >
              <div className="p-2 text-sm">
                <h4 className=" flex items-center ">
                  <hr className="w-20 h-1 px-3 bg-blue-800" />
                  <span className="pl-2"> : Shortest Road </span>
                </h4>
              </div>
              <div className="p-2 text-sm">
                <h4 className=" flex items-center ">
                  <hr className="w-6 h-6 px-3 bg-blue-800" />
                  <span className="pl-2"> : Construction Area </span>
                </h4>
              </div>
            </div>
          </div>
          {openDirection && (
            <div className="absolute w-max h-fit bg-white text-2xl   font-bold rounded-xl px-2 py-4 shadow-xl  top-0 right-[50%]">
              {vehicalData.Alert}
            </div>
          )}
          {openAccident && (
            <div className="absolute w-max h-fit bg-red-500 text-white text-4xl font-bold rounded-xl px-2 py-4 shadow-xl  bottom-2 right-[50%]">
              {alert}
            </div>
          )}
          {clickedCoordinates && (
            <div
              className="absolute w-max h-fit bg-white rounded-xl px-2 py-1 shadow-xl  bottom-0 right-2"
              title="latitude, longitude"
            >
              <p>
                {" "}
                {clickedCoordinates.lat}, {clickedCoordinates.lng}
              </p>
            </div>
          )}
          {clickedShape && (
            <div className=" absolute h-max max-h-32 shadow-lg rounded-lg overflow-y-scroll w-60 p-2 text-md bg-white/95 xl:right-[40%] bottom-10 right-16">
              <button
                onClick={() => {
                  setClickedShape(false);
                  setClickedShapeData({});
                }}
                className=" absolute -top-1 z-30  right-0  rounded-full p-1"
              >
                <IoClose size={24} />
              </button>
              <h1>Name : {clickedShapeData.s_name}</h1>
              {clickedShapeData.type === "polyline" && (
                <h1>Score : {clickedShapeData.s_score}</h1>
              )}
              {clickedShapeData.type === "polyline" && (
                <h1>
                  Visited Vehicle :{" "}
                  {clickedShapeData.visited_vehicle
                    ? clickedShapeData.visited_vehicle
                    : "0"}
                </h1>
              )}
              <h1>Details : {clickedShapeData.s_details}</h1>
            </div>
          )}
        </div>
        <div className="h-[25vh]  flex  overflow-x-scroll">
          <Weather />
          <WeatherData />

          <div className="w-[60vw] h-[25vh] bg-sky-300 ">
            <Camera />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempDriver;
