import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Diagnosa } from "./pages";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="diagnosa" element={<Diagnosa />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
