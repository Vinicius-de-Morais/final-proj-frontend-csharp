import logo from "./logo.svg";
import React from "react";
import "./App.css";
import { Navigate, Route, Router, Routes, useNavigate } from "react-router-dom";
import HomeScreen from "./pages/home";
import LoginScreen from "./pages/login";
import AdmLoginScreen from "./pages/Adm/admLogin";
import AdmPainelScreen from "./pages/Adm/admPainel";
import AdmOverView from "./pages/Adm/PainelForm/admOverView";



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" extat element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/adm" element={<AdmLoginScreen />} />
        <Route path="/painel" extat element={<AdmPainelScreen />} />
        <Route path="/admOverView" extat element={<AdmOverView />} />
      </Routes>
    </div>
  );
}

export default App;
