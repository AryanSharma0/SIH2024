import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
function Camera() {
  const webRef = useRef(null);
  const canvasRef = useRef(null);
  const snapshotCanvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [contrast, setContrast] = useState(1.635);
  const [brightness, setBrightness] = useState(0.5);
  const [exposure, setExposure] = useState(1);
  const [shadow, setShadow] = useState(1.045);
  const [blackAndWhite, setBlackAndWhite] = useState(false);
  const [structure, setStructure] = useState(0.91);
  const [detail, setDetail] = useState(0.62);
  const [sharpening, setSharpening] = useState(1.045);
  const [invertImage, setInvertImage] = useState(true);
  const [infraredEffect, setInfraredEffect] = useState(true);
  const [thermalEffect, setThermalEffect] = useState(false);
  const [openimageEditor, setImageEditor] = useState(false);
  const [dehaze, setDehaze] = useState(0.5);
  const applyFilters = (imageData) => {
    const data = imageData.data;
    console.log("Apply Filter");

    // Apply contrast
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * contrast;
      data[i + 1] = data[i + 1] * contrast;
      data[i + 2] = data[i + 2] * contrast;
    }

    // Apply brightness
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * brightness;
      data[i + 1] = data[i + 1] * brightness;
      data[i + 2] = data[i + 2] * brightness;
    }

    // Apply exposure
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.pow(data[i], exposure);
      data[i + 1] = Math.pow(data[i + 1], exposure);
      data[i + 2] = Math.pow(data[i + 2], exposure);
    }

    // Apply shadow
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] + shadow;
      data[i + 1] = data[i + 1] + shadow;
      data[i + 2] = data[i + 2] + shadow;
    }

    // Convert to black and white
    if (blackAndWhite) {
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
    }

    // Enhance structure
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * structure;
      data[i + 1] = data[i + 1] * structure;
      data[i + 2] = data[i + 2] * structure;
    }

    // Enhance detail
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * detail;
      data[i + 1] = data[i + 1] * detail;
      data[i + 2] = data[i + 2] * detail;
    }

    // Apply dehaze filter
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] + data[i] * dehaze; // Adjust red channel
      data[i + 1] = data[i + 1] + data[i + 1] * dehaze; // Adjust green channel
      data[i + 2] = data[i + 2] + data[i + 2] * dehaze; // Adjust blue channel
    }

    // Apply sharpening
    const sharpenedData = applySharpeningFilter(imageData, sharpening);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = sharpenedData[i];
      data[i + 1] = sharpenedData[i + 1];
      data[i + 2] = sharpenedData[i + 2];
    }

    // Invert Image
    if (invertImage) {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
      }
    }

    // Simulate Infrared Effect
    if (infraredEffect) {
      // Apply your infrared effect here
      // Example: Convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
    }

    // Simulate Thermal Effect
    if (thermalEffect) {
      // Apply your thermal effect here
      // Example: Apply color mapping for thermal visualization
      for (let i = 0; i < data.length; i += 4) {
        // Apply a colormap based on temperature values
        // (For demonstration purposes, you may need to define a specific colormap)
        // Example: Heat colormap
        data[i] = 255; // Red
        data[i + 1] = Math.min(255, data[i + 2] * 1.5); // Green
        data[i + 2] = Math.min(255, data[i + 2] * 3); // Blue
      }
    }
  };

  const applySharpeningFilter = (imageData, strength) => {
    console.log("apply sharpening filter");
    const weights = [-1, -1, -1, -1, 9 + strength, -1, -1, -1, -1];

    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);

    const src = imageData.data;
    const sw = imageData.width;
    const sh = imageData.height;

    const output = new Float32Array(sw * sh * 4);

    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const sy = y;
        const sx = x;
        const dstOff = (y * sw + x) * 4;
        let r = 0,
          g = 0,
          b = 0,
          a = 0;
        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            const scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
            const scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
            const srcOff = (scy * sw + scx) * 4;
            const wt = weights[cy * side + cx];
            r += src[srcOff] * wt;
            g += src[srcOff + 1] * wt;
            b += src[srcOff + 2] * wt;
            a += src[srcOff + 3] * wt;
          }
        }
        output[dstOff] = r;
        output[dstOff + 1] = g;
        output[dstOff + 2] = b;
        output[dstOff + 3] = a;
      }
    }

    const clampedArray = new Uint8ClampedArray(output);
    const sharpenedImageData = new ImageData(clampedArray, sw, sh);
    return sharpenedImageData.data;
  };

  const captureFrame = () => {
    if (webRef.current && canvasRef.current && snapshotCanvasRef.current) {
      console.log("Capture Frame");
      // Capture a single frame
      const imageDataUri = webRef.current.getScreenshot();

      // Display the frame on the canvas
      const context = canvasRef.current.getContext("2d");
      const snapshotContext = snapshotCanvasRef.current.getContext("2d");

      const img = new Image();
      img.onload = function () {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        context.drawImage(
          img,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        // Capture and display the data frame on the right side
        const imageData = context.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        applyFilters(imageData); // Apply filters
        snapshotCanvasRef.current.width = canvasRef.current.width;
        snapshotCanvasRef.current.height = canvasRef.current.height;
        snapshotContext.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        snapshotContext.putImageData(imageData, 0, 0);

        // Set the captured image state for further use
        setCapturedImage(imageDataUri);
      };

      img.src = imageDataUri;
    }
  };

  useEffect(() => {
    console.log("UseEffect image capture ");

    const timeId = setInterval(() => {
      captureFrame();
    }, 200);
    return () => clearInterval(timeId);
  }, []);
  const [predictions, setPredictions] = useState([]);

  const detectObjects = useCallback(async () => {
    console.log("Object detection");

    const model = await cocossd.load();
    const predictions = await model.detect(snapshotCanvasRef.current);
    setPredictions(predictions);

    // Dispose of the model to release resources
    model.dispose();
  }, []);

  useEffect(() => {
    const timeId = setInterval(() => {
      if (snapshotCanvasRef.current) {
        detectObjects();
      }
      console.log("UseEffect detect Object");
    }, 1500);
    return () => clearInterval(timeId);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center" }} className="w-full">
      {/* <button onClick={() => setImageEditor((prev) => !prev)}>Toogle</button> */}
      <>
        <div style={{ marginRight: "10px" }}>
          <Webcam ref={webRef} className=" h-[25vh] w-[30vw]" />
          <canvas
            ref={canvasRef}
            style={{ display: "none", position: "absolute", top: 0, left: 0 }}
            className="h-[24vh]"
          />
          {/* <button onClick={captureFrame} className="">
              Capture Image
            </button> */}
        </div>
        <div style={{ position: "relative" }}>
          {capturedImage && (
            <div className="hidden">
              <img
                src={capturedImage}
                className="w-full h-[15vh] hidden"
                alt="Captured"
                style={{ border: "1px solid #ccc" }}
              />
            </div>
          )}
          <canvas
            ref={snapshotCanvasRef}
            className="w-full h-[25vh]"
            style={{ border: "1px solid #ccc" }}
          />
          {console.log("asdfsdf")}
          {predictions.map((prediction, index) => (
            <div key={index}>
              <p></p>
              <div
                style={{
                  border: "solid",
                  text: "white",
                  borderWidth: "2px",
                  position: "absolute",
                  left: prediction.bbox[0],
                  top: prediction.bbox[1] + 20,
                  width: prediction.bbox[2],
                  height: prediction.bbox[3],
                  borderColor: "red",
                }}
              >
                {prediction.class} - {Math.round(prediction.score * 100)}%
              </div>
            </div>
          ))}
        </div>
      </>

      <div className=" h-[20vh] hidden ">
        <div>
          <label>Contrast: {contrast}</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.005"
            value={contrast}
            onChange={(e) => setContrast(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Dehaze: {dehaze}</label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.005"
            value={dehaze}
            onChange={(e) => setDehaze(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Brightness: {brightness}</label>
          <input
            type="range"
            min="1"
            max="2"
            step="0.005"
            value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Exposure: {exposure}</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.005"
            value={exposure}
            onChange={(e) => setExposure(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Shadow: {shadow}</label>
          <input
            type="range"
            min="-50"
            max="50"
            step="0.1"
            value={shadow}
            onChange={(e) => setShadow(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Black and White:</label>
          <input
            type="checkbox"
            checked={blackAndWhite}
            onChange={(e) => setBlackAndWhite(e.target.checked)}
          />
        </div>
        <div>
          <label>Structure: {structure}</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.005"
            value={structure}
            onChange={(e) => setStructure(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Detail: {detail}</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.005"
            value={detail}
            onChange={(e) => setDetail(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Sharpening: {sharpening}</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.005"
            value={sharpening}
            onChange={(e) => setSharpening(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Invert Image:</label>
          <input
            type="checkbox"
            checked={invertImage}
            onChange={(e) => setInvertImage(e.target.checked)}
          />
        </div>
        <div>
          <label>Infrared Effect:</label>
          <input
            type="checkbox"
            checked={infraredEffect}
            onChange={(e) => setInfraredEffect(e.target.checked)}
          />
        </div>
        <div>
          <label>Thermal Effect:</label>
          <input
            type="checkbox"
            checked={thermalEffect}
            onChange={(e) => setThermalEffect(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}

export default Camera;
