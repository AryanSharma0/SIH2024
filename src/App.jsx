import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DriverHome from "./Screen/DriverHome";
import "../src/Style/output.css";
import "./Style/input.css";
import Temp from "./Screen/Temp";
import AdminHome from "./Screen/AdminHome";
import TempDriver from "./Screen/TempDriver";
import Camera from "./Screen/Camera";
function App() {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route index path="/" element={<DriverHome />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/temp" element={<TempDriver />} />
        <Route path="/cam" element={<Camera />} />
      </Routes>

      {/* <Footer /> */}
    </Router>
  );
}

export default App;
