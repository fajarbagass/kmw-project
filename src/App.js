// import css global
import './App.css';
// import library untuk melakukan route
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import file dari folder pages untuk ditampilkan
import {Home, Login} from "./pages";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* tag route digunakan untuk mengatur alamat URL */}
          <Route path="/" element={<Home/>} />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
