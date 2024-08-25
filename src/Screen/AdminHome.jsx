import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Polygon,
  Polyline,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { FaRegSave } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { GiArrowCursor } from "react-icons/gi";
import { AiOutlineGateway } from "react-icons/ai";
import { AiOutlineLine } from "react-icons/ai";
import { FaMapMarker } from "react-icons/fa";
import "../Style/output.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { IoClose } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { db } from "../firebase";
import Weather from "../Component/Weather";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import WeatherData from "../Component/WeatherData";
import { useSpeechSynthesis } from "react-speech-kit";
import useVehicalData from "../Hooks/useVehicalData";
import {
  useVehicle2DemoMotion,
  useVehicle3DemoMotion,
} from "../Hooks/useVehicleDemoMotion";
import useShapes from "../Hooks/useShape";

const AdminHome = () => {
  const [clickedCoordinates, setClickedCoordinates] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  const [path, setPath] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [editingMode, setEditingMode] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const [shape, setShape] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [initialCoordinate, setInitialCoordinate] = useState({
    lat: 18.851424,
    lng: 83.020843,
  });
  const [mapZoom, setMapZoom] = useState(15);
  const [openshapeHint, setOpenShapeHint] = useState(false);
  const [instruction, setInstruction] = useState("Move straight");
  const [formData, setFormData] = useState({
    s_name: "",
    s_color: "#000",
    s_instruction: "Move Straight",
    s_score: "0",
    s_details: "",
    temp_id: "",
  });
  const [clickedShape, setClickedShape] = useState(false);
  const [clickedShapeData, setClickedShapeData] = useState({});

  // All the refs
  const shapesRef = useRef(null);
  const listenersRef = useRef([]);
  const mapRef = useRef();

  // For backend
  const collectionRef = collection(db, "GeoFencing");

  // First Vehicle data update
  var vehicalData = useVehicalData();

  var alert = vehicalData.accident;
  // Second Car Position Update;
  const vehical2Data = useVehicle2DemoMotion();

  // Third Car Position Update
  const vehical3Data = useVehicle3DemoMotion();

  const shapesData = useShapes();
  // Fetch data when the component mounts
  useEffect(() => {
    setShape(shapesData);
  }, [shapesData]);

  // Map Initialise
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // For draggable and editable features
  const onEdit = useCallback(() => {
    if (shapesRef.current) {
      const nextPath = shapesRef.current
        .getPath()
        .getArray()
        .map((latLng) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
    }
  }, []);

  // For draggable and editable features
  const onLoad = useCallback(
    (shape) => {
      shapesRef.current = shape;
      const path = shape.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  // For draggable and editable features
  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis) => lis.remove());
    shapesRef.current = null;
  }, []);

  // On Clicking on any map location
  const handleMapClick = useCallback(
    (event) => {
      const clickedLat = event.latLng.lat();
      const clickedLng = event.latLng.lng();
      setClickedCoordinates({ lat: clickedLat, lng: clickedLng });

      if (editingMode) {
        // Set the initial instruction or keep the existing one

        setInstruction("Move Straight");
        if (selectedShape === "marker") {
          const updatedPath = { lat: clickedLat, lng: clickedLng, instruction };
          setMarkerPosition(updatedPath);
        } else {
          const updatedPath = [
            ...path,
            { lat: clickedLat, lng: clickedLng, instruction },
          ];
          setPath(updatedPath);
        }
      } else {
        setClickedShape(false);
        setClickedShapeData({});
        setInstruction("Move straight");
      }
    },
    [editingMode, instruction, path, selectedShape]
  );

  const handleInputInstructionChange = (event) => {
    // Update the instruction when the input changes
    setInstruction(event.target.value);

    // If there is a clicked coordinate, update its instruction
    if (clickedCoordinates) {
      setPath((prevPath) => {
        const existingPointIndex = prevPath.findIndex(
          (point) =>
            point.lat === clickedCoordinates.lat &&
            point.lng === clickedCoordinates.lng
        );

        if (existingPointIndex !== -1) {
          const updatedPath = [...prevPath];
          updatedPath[existingPointIndex].instruction = event.target.value;
          return updatedPath;
        }

        return prevPath;
      });
    }
  };
  // On adding new polygon
  const handleAddNewPolygon = useCallback(() => {
    setSelectedShape("polygon");
    setEditingMode(true);
  }, []);

  // On adding new polygon
  const handleAddNewPolyline = useCallback(() => {
    setSelectedShape("polyline");
    setEditingMode(true);
  }, []);

  // On adding new polygon
  const handleAddNewMarker = useCallback(() => {
    setSelectedShape("marker");
    setEditingMode(true);
  }, []);

  // On clearing current state
  const handleClearCurrentShape = useCallback(() => {
    setPath([]); // Clear the current path
    setFormData({
      s_name: "",
      s_color: "#000",
      s_instruction: "Move Straight",
      s_score: "0",
      s_details: "",
    });
    setEditingMode(true);
  }, []);

  // For saving any shapes
  const handleSaveShape = useCallback(async () => {
    if (path.length < 3) return;

    const data = {
      s_name: formData.s_name,
      s_score: formData.s_score,
      path: [...path],
      s_color: formData.s_color,
      s_instruction: formData.s_instruction,
      type: selectedShape,
      s_details: formData.s_details,
      temp_id: formData.temp_id,
    };

    try {
      if (selectedShapeIndex !== null) {
        const docRef = doc(collectionRef, shape[selectedShapeIndex]._id);
        await updateDoc(docRef, data);
        setShape((prevShape) =>
          prevShape.map((shape, index) =>
            index === selectedShapeIndex ? { ...shape, ...data } : shape
          )
        );
      } else {
        if (selectedShape === "marker") {
          if (!markerPosition) return;
          const newDocRef = await addDoc(collectionRef, {
            ...data,
            path: markerPosition,
          });
          setShape((prevShape) => [
            ...prevShape,
            { _id: newDocRef.id, ...data },
          ]);
        } else {
          const newDocRef = await addDoc(collectionRef, data);
          setShape((prevShape) => [
            ...prevShape,
            { _id: newDocRef.id, ...data },
          ]);
        }
      }
      setSelectedShapeIndex(null);
    } catch (error) {
      console.error(
        `Error ${
          selectedShapeIndex !== null ? "updating" : "adding"
        } ${selectedShape}:`,
        error
      );
      alert("Failed to save data. Please try again later.");
    }

    setPath([]);
    setEditingMode(false);
    setSelectedShape(null);
    setMarkerPosition(null);
    setFormData({
      s_name: "",
      s_color: "#000",
      s_instruction: "Move Straight",
      s_score: "0",
      temp_id: "",
    });
  }, [
    path,
    selectedShape,
    selectedShapeIndex,
    collectionRef,
    shape,
    formData,
    markerPosition,
  ]);

  // On deleting any shape
  const handleDeleteShape = useCallback(async (shapeId, index) => {
    try {
      const shapeDocRef = doc(collectionRef, shapeId);
      await deleteDoc(shapeDocRef).then(() => {
        // Update the local state to reflect the deletion
        setShape((prevShapes) => {
          const updatedShapes = [...prevShapes];
          updatedShapes.splice(index, 1);
          return updatedShapes;
        });

        // Deselect after deletion
        setSelectedShapeIndex(null);
      });
    } catch (error) {
      console.error("Error deleting shape:", error);
    }
  }, []);

  // on color change for specific shape
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // For   editing Any shape
  const editingShape = useCallback(
    (index) => {
      console.log(shape[index].type);
      setEditingMode(true);
      setSelectedShapeIndex(index);
      setSelectedShape(shape[index].type);
      setFormData({
        s_name: shape[index].s_name,
        s_color: shape[index].s_color,
        s_instruction: shape[index].s_instruction,
        s_score: shape[index].s_score,
        s_details: shape[index]?.s_details,
        temp_id: shape[index].temp_id,
      });
      setPath([...shape[index].path]);
    },
    [shape]
  );

  // For  deselecting and coming to non editing state
  const handleDeselect = useCallback(() => {
    setEditingMode(false);
    setSelectedShapeIndex(null);
    setPath([]);
    setSelectedShape(null);
    setFormData({
      s_name: "",
      s_color: "#000",
      s_instruction: "Move Straight",
      s_score: "0",
      s_details: "",
      temp_id: "",
    });
  }, []);

  const onShapeClick = (shape) => {
    console.log(shape);
    if (shape.type === "marker") {
      setInitialCoordinate(shape.path);
    } else {
      setInitialCoordinate(shape.path[0]);
    }
    setMapZoom(16);
    setClickedShape(true);
    setClickedShapeData(shape);
  };

  const handlePolylineClick = (e) => {
    // Extract the clicked coordinates from the event
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();
    console.log(e);

    // Store the clicked coordinates in the state
    setClickedCoordinates({ lat: clickedLat, lng: clickedLng });
    if (editingMode) {
      // Set the initial instruction or keep the existing one

      if (selectedShape === "marker") {
        const updatedPath = { lat: clickedLat, lng: clickedLng, instruction };
        setMarkerPosition(updatedPath);
      } else {
        const updatedPath = [
          ...path,
          { lat: clickedLat, lng: clickedLng, instruction },
        ];
        setPath(updatedPath);
      }
    } else {
      setClickedShape(false);
      setClickedShapeData({});
    }
    // You can do more with the clicked coordinates if needed
    console.log("Clicked Coordinates:", { lat: clickedLat, lng: clickedLng });
  };

  useEffect(() => {
    return () => {
      listenersRef.current.forEach((lis) => lis.remove());
    };
  }, []);

  const { speak } = useSpeechSynthesis();

  const [openAccident, setOpenAccident] = useState();
  const speaks = (text) => {
    speak({ text: text });
  };

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

  // Map OutPuts
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps...";

  return (
    <div className="flex h-screen w-screen">
      <div className="   z-10   rounded-r-lg  bg-[#ffffff] px-2 w-[30vw] h-[20vh]  lg:w-[20vw]">
        <MenuBar
          handleAddNewMarker={handleAddNewMarker}
          handleAddNewPolygon={handleAddNewPolygon}
          handleAddNewPolyline={handleAddNewPolyline}
          handleDeselect={handleDeselect}
          handleClearCurrentShape={handleClearCurrentShape}
          handleSaveShape={handleSaveShape}
        />
        {editingMode && (
          <FormAreaForNewShape
            selectedShape={selectedShape}
            formData={formData}
            handleChange={handleChange}
            handleInputInstructionChange={handleInputInstructionChange}
            instruction={instruction}
          />
        )}

        {!editingMode && (
          <>
            <div className="my-3 bg-[#e7e7e7] rounded-md shadow-lg p-1">
              <h2 className="text-xl mb-2">Polygon List</h2>
              <ul className="h-[25vh] overflow-y-scroll">
                {selectedShape && (
                  <li
                    key={selectedShapeIndex}
                    className={`mb-2 shadow-md border-2 rounded-lg cursor-pointer p-4 flex items-center ${"bg-[#20a6ff]"}`}
                  >
                    <div
                      className="w-5 h-5 mr-2 "
                      style={{
                        backgroundColor: shape[selectedShapeIndex].s_color,
                        border: "1px solid #ccc",
                      }}
                    ></div>
                    <span
                      className=" truncate"
                      title={
                        typeof shape[selectedShapeIndex].s_name === "string"
                          ? selectedShape.s_name
                          : ""
                      }
                    >
                      {shape[selectedShapeIndex].s_name}
                    </span>

                    <button
                      className="mr-2"
                      onClick={() =>
                        handleDeleteShape(
                          shape[selectedShapeIndex]._id,
                          shape[selectedShapeIndex].index
                        )
                      }
                    >
                      <MdDelete size={20} />
                    </button>
                    <button
                      onClick={() => {
                        let index = shape.findIndex(
                          (shapeData) =>
                            shapeData._id === shape[selectedShapeIndex]._id
                        );
                        editingShape(index);
                      }}
                    >
                      <FaRegEdit size={20} />
                    </button>
                  </li>
                )}

                {shape.map(
                  (shapes, index) =>
                    shapes.type === "polygon" && (
                      <li
                        key={index}
                        className={`mb-2 shadow-md border-2 rounded-lg cursor-pointer p-4 flex items-center ${
                          selectedShapeIndex === index ? "bg-[#e0e0e0]" : ""
                        }`}
                      >
                        <div
                          className="w-5 h-5 mr-2 "
                          style={{
                            backgroundColor: shapes.s_color,
                            border: "1px solid #ccc",
                          }}
                        ></div>
                        {editingMode &&
                        selectedShapeIndex === index &&
                        !selectedShape === "polyline" ? (
                          <input
                            type="text"
                            name="s_name"
                            value={formData.s_name}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter polygon's name"
                          />
                        ) : (
                          <span
                            className=" truncate"
                            title={
                              typeof shapes.s_name === "string"
                                ? shapes.s_name
                                : ""
                            }
                          >
                            {shapes.s_name}
                          </span>
                        )}
                        <button
                          className="mr-2"
                          onClick={() => handleDeleteShape(shapes._id, index)}
                        >
                          <MdDelete size={20} />
                        </button>
                        <button onClick={() => editingShape(index)}>
                          <FaRegEdit size={20} />
                        </button>
                      </li>
                    )
                )}
              </ul>
            </div>

            <div className="mb-3 bg-[#e7e7e7] rounded-md shadow-lg p-1">
              <h2 className="text-xl mb-2">Polylines List</h2>
              <ul className="h-[25vh] overflow-y-scroll">
                {shape.map(
                  (shapes, index) =>
                    shapes.type === "polyline" && (
                      <li
                        key={index}
                        className={`mb-2 shadow-md border-2 rounded-lg cursor-pointer p-4 flex items-center ${
                          selectedShapeIndex === index ? "bg-[#e0e0e0]" : ""
                        }`}
                      >
                        <div
                          className="w-5 h-5 mr-2 "
                          style={{
                            backgroundColor: shapes.s_color,
                            border: "1px solid #ccc",
                          }}
                        ></div>
                        {editingMode &&
                        selectedShapeIndex === index &&
                        selectedShape === "polyline" ? (
                          <input
                            type="text"
                            name="s_name"
                            value={formData.s_name}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter polyline's name"
                          />
                        ) : (
                          <span
                            className=" truncate"
                            title={
                              typeof shapes.s_name === "string"
                                ? shapes.s_name
                                : ""
                            }
                          >
                            {shapes.s_name}
                          </span>
                        )}
                        <button
                          className="mr-2"
                          onClick={() => handleDeleteShape(shapes._id, index)}
                        >
                          <MdDelete size={20} />
                        </button>
                        <button onClick={() => editingShape(index)}>
                          <FaRegEdit size={20} />
                        </button>
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
                          selectedShapeIndex === index ? "bg-[#e0e0e0]" : ""
                        }`}
                      >
                        <FaLocationDot className="pr-1" size={18} />
                        {editingMode &&
                        selectedShapeIndex === index &&
                        selectedShape === "marker" ? (
                          <input
                            type="text"
                            name="s_name"
                            value={formData.s_name}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter polyline's name"
                          />
                        ) : (
                          <span
                            className=" truncate"
                            title={
                              typeof shapes.s_name === "string"
                                ? shapes.s_name
                                : ""
                            }
                          >
                            {shapes.s_name}
                          </span>
                        )}
                        <button
                          className="mr-2"
                          onClick={() => handleDeleteShape(shapes._id, index)}
                        >
                          <MdDelete size={20} />
                        </button>
                        <button onClick={() => editingShape(index)}>
                          <FaRegEdit size={20} />
                        </button>
                      </li>
                    )
                )}
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="h-screen w-[70vw] lg:w-[80vw]   ">
        <div className="   h-[75vh] relative">
          <GoogleMap
            mapContainerClassName="h-full  flex"
            center={initialCoordinate}
            zoom={mapZoom}
            onLoad={onMapLoad}
            onClick={handleMapClick}
          >
            {path.length > 0 && selectedShape === "polygon" && (
              <Polygon
                editable={editingMode}
                draggable={editingMode}
                path={path}
                onMouseUp={onEdit}
                // Event used when dragging the whole Polygon
                onDragEnd={onEdit}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                  fillColor: formData.s_color,
                  strokeColor: formData.s_color,
                  fillOpacity: 0.5,
                  strokeWeight: 2,
                }}
              />
            )}
            {shape.map(
              (shapes, index) =>
                shapes.type === "polygon" && (
                  <Polygon
                    key={index}
                    path={shapes.path}
                    options={{
                      fillColor: shapes.s_color,
                      strokeColor: shapes.s_color,
                      fillOpacity: selectedShapeIndex === index ? 0.6 : 0.4,
                      strokeWeight: selectedShapeIndex === index ? 3 : 1,
                    }}
                    editable={index === selectedShapeIndex && editingMode}
                    draggable={index === selectedShapeIndex && editingMode}
                    onMouseUp={onEdit}
                    onDragEnd={onEdit}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={() => onShapeClick(shapes)}
                  />
                )
            )}
            <Marker
              position={vehical2Data}
              onClick={() => setInfoWindowOpen("v2")}
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
              // onClick={handleMarkerClick}
            >
              {infoWindowOpen === "v2" && (
                <InfoWindow
                  // disableAutoPan={true}
                  position={{
                    lat: vehical2Data.lat + 0.001,
                    lng: vehical2Data.lng,
                  }}
                  onCloseClick={() => setInfoWindowOpen(null)}
                >
                  <div>
                    <p>{"20Km/h"}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
            <Marker
              position={vehical3Data}
              onClick={() => setInfoWindowOpen("v3")}
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
            >
              {infoWindowOpen === "v3" && (
                <InfoWindow
                  disableAutoPan={true}
                  position={{
                    lat: vehical3Data.lat + 0.001,
                    lng: vehical3Data.lng,
                  }}
                  onCloseClick={() => setInfoWindowOpen(null)}
                >
                  <div>
                    <p>{"20Km/h"}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
            {path.length > 0 && selectedShape === "polyline" && (
              <Polyline
                draggable={editingMode && selectedShape === "polyline"}
                editable={editingMode && selectedShape === "polyline"}
                path={path} // Use the common path state for both polygons and polylines
                onMouseUp={onEdit}
                // Event used when dragging the whole Polygon
                onDragEnd={onEdit}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                  strokeColor: formData.s_color,
                  strokeOpacity: 1,
                  strokeWeight: 2,
                }}
                // onClick={handlePolylineClick}
              />
            )}
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
            ></Marker>
            {shape.map(
              (shapes, index) =>
                shapes?.type === "polyline" &&
                (!editingMode ? (
                  <Polyline
                    key={index}
                    path={shapes.path}
                    options={{
                      strokeColor: shapes.s_color,
                      strokeOpacity: 1,
                      strokeWeight: 2,
                    }}
                    onClick={(e) => {
                      handlePolylineClick(e);
                      onShapeClick(shapes);
                    }}
                  />
                ) : (
                  <React.Fragment key={index}>
                    <Polyline
                      path={shapes.path}
                      options={{
                        strokeColor: shapes.s_color,
                        strokeOpacity: 1,
                        strokeWeight: 2,
                      }}
                      onClick={(e) => {
                        handlePolylineClick(e);
                        onShapeClick(shapes);
                      }}
                    />
                    {shapes.path.map((coordinate, coordinateIndex) => (
                      <Marker
                        key={`${index}-${coordinateIndex}`}
                        position={coordinate}
                        options={{
                          icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            fillColor: "#FFD700", // Set the background color
                            fillOpacity: 1,
                            strokeWeight: 0,
                            scale: 8, // Adjust the size of the marker
                          },
                        }}
                        onClick={(e) => {
                          // Handle marker click if needed
                          handlePolylineClick(e);
                        }}
                      >
                        {/* You can optionally include content inside the Marker */}
                        <div className="shadow-md h-4 w-4 bg-yellow-400"></div>
                      </Marker>
                    ))}
                  </React.Fragment>
                ))
            )}

            {path.length >= 0 && selectedShape === "marker" && (
              <Marker
                position={markerPosition} // Use markerPosition instead of path
                onDragEnd={(event) => {
                  const newPosition = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                  };
                  setMarkerPosition(newPosition);
                }}
              />
            )}

            {shape.map(
              (shapes, index) =>
                shapes?.type === "marker" && (
                  <Marker
                    // label={shapes.s_name}
                    title={
                      typeof shapes.s_name === "string" ? shapes.s_name : ""
                    }
                    key={index}
                    position={shapes.path}
                    onClick={() => onShapeClick(shapes)}
                    options={{
                      icon: {
                        url: require("../Asset/warning-icon.webp"),
                        scaledSize: new window.google.maps.Size(
                          mapRef.current.data
                            ? mapRef.current.data.map.zoom * 2
                            : 60,
                          mapRef.current ? mapRef.current.data.map.zoom * 2 : 50
                        ),
                        // anchor: new window.google.maps.Point(20, 20),
                      },
                    }}
                  />
                )
            )}
          </GoogleMap>
          {openAccident && (
            <div className="absolute w-max h-fit bg-red-500 text-white text-4xl font-bold rounded-xl px-2 py-4 shadow-xl  bottom-2 right-[50%]">
              {alert}
            </div>
          )}
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

              <h1>
                Details :{" "}
                {clickedShapeData.s_details === ""
                  ? "NA"
                  : clickedShapeData.s_details}
              </h1>
            </div>
          )}
        </div>
        <div className="h-[25vh]  flex  overflow-x-scroll">
          <Weather />
          <WeatherData />

          <div className="min-w-[20rem] h-[25vh] bg-yellow-300 "></div>
          <div className="min-w-[20rem] h-[25vh] bg-sky-300 "></div>
        </div>
      </div>
    </div>
  );
};

const MenuBar = ({
  handleAddNewMarker,
  handleAddNewPolygon,
  handleAddNewPolyline,
  handleDeselect,
  handleClearCurrentShape,
  handleSaveShape,
}) => {
  return (
    <div className=" mt-2 h-26 justify-between py-2  flex-wrap bg-[#e7e7e7] px-2 shadow-md flex w-full">
      <button
        className="mr-2 p-2 border-2 bg-[#d1d1d1] hover:scale-105 active:scale-95 rounded-md shadow-md"
        onClick={handleAddNewMarker}
        title="Add new Marker"
      >
        <FaMapMarker size={20} />{" "}
      </button>
      <button
        className="mr-2 p-2 border-2 bg-[#d1d1d1] hover:scale-105 active:scale-95 rounded-md shadow-md"
        onClick={handleAddNewPolygon}
        title="Add new Polygon"
      >
        <AiOutlineGateway size={20} />{" "}
      </button>
      <button
        className="mr-2 p-2 border-2 bg-[#d1d1d1] hover:scale-105 active:scale-95 rounded-md shadow-md"
        onClick={handleAddNewPolyline}
        title="Add new Polyline"
      >
        <AiOutlineLine className="" size={20} />
      </button>
      <button
        title="Deselect"
        className="mr-2 p-2 border-2 bg-[#d1d1d1] hover:scale-105 active:scale-95 rounded-md shadow-md"
        onClick={handleDeselect}
      >
        <GiArrowCursor size={20} />{" "}
      </button>

      <button
        title="Reset"
        className="mr-2 p-2 border-2 bg-[#d1d1d1] hover:scale-105 active:scale-95 rounded-md shadow-md"
        onClick={handleClearCurrentShape}
      >
        <IoMdRefresh size={20} />
      </button>
      <button
        className="mr-2 p-2 border-2 bg-[#d1d1d1] hover:scale-105 active:scale-95 rounded-md shadow-md"
        onClick={handleSaveShape}
        title="Save"
      >
        <FaRegSave size={20} />
      </button>
    </div>
  );
};

const FormAreaForNewShape = ({
  selectedShape,
  formData,
  handleChange,
  handleInputInstructionChange,
  instruction,
}) => {
  return (
    <div className="mb-4   pt-4">
      <div>
        <label className=" block mb-2">
          {selectedShape === "polyline"
            ? "Polyline Name:"
            : selectedShape === "polygon"
            ? "Polygon Name:"
            : "Marker Name:"}
        </label>
        <input
          name="s_name"
          type="text"
          className=" outline-none p-2 focus:border-2 w-[28vw] lg:w-[19vw] rounded-lg border-neutral-950"
          value={formData.s_name}
          onChange={(e) => handleChange(e)}
          placeholder={
            selectedShape === "polyline"
              ? "Polyline Name:"
              : selectedShape === "polygon"
              ? "Polygon Name:"
              : "Marker Name:"
          }
        />
      </div>
      <div className="flex justify-around pt-3">
        <label className="block mb-2">Choose Color:</label>
        <input
          className="w-8 rounded-full h-8 "
          name="s_color"
          type="color"
          value={formData.s_color}
          onChange={(e) => handleChange(e)}
        />
      </div>
      {selectedShape === "polyline" && (
        <div className="flex justify-around pt-3 items-center">
          <label className="block mb-2 w-full ">Temp Id : </label>
          <input
            className=" p-2 bg-slate-200 w-16 max-w-md rounded-md border border-[#c2c2c2] outline-none focus:border-2 focus:border-[#b9b9b9]"
            name="temp_id"
            type="text"
            value={formData.temp_id}
            placeholder="0.0"
            onChange={(e) => {
              console.log(e.target.value);
              handleChange(e);
            }}
          />
        </div>
      )}
      {selectedShape === "polyline" && (
        <div className="pt-3   ">
          <label className="block mb-2 w-full ">Give instructions : </label>
          <textarea
            className="p-1 w-[28vw] lg:w-[19vw] bg-[#ececec] rounded-md  border border-[#a7a7a7]"
            name="s_instruction"
            type="text"
            value={instruction}
            placeholder="Enter instructions/data"
            onChange={(e) => handleInputInstructionChange(e)}
          />
        </div>
      )}
      <div className="pt-3   ">
        <label className="block mb-2 w-full ">Details : </label>
        <textarea
          className="p-1 w-[28vw] lg:w-[19vw] bg-[#ececec] rounded-md  border border-[#a7a7a7]"
          name="s_details"
          type="text"
          value={formData.s_details}
          placeholder="Enter instructions/data"
          onChange={(e) => handleChange(e)}
        />
      </div>
      {selectedShape === ("polyline" || "polygon") && (
        <div className="flex justify-around pt-3 items-center">
          <label className="block mb-2 w-full ">Give Scores : </label>
          <input
            className=" p-2 bg-slate-200 w-16 max-w-md rounded-md border border-[#c2c2c2] outline-none focus:border-2 focus:border-[#b9b9b9]"
            name="s_score"
            type="number"
            value={formData.s_score}
            placeholder="0"
            onChange={(e) => handleChange(e)}
          />
        </div>
      )}
    </div>
  );
};
export default AdminHome;
