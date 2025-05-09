import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Catalog from "./pages/Catalog";
import Viewer from "./pages/Viewer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Designs from "./pages/Designs";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/designs" element={<Designs />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
