import logo from "./logo.svg";
import React from "react";
import "./App.css";
import { Navigate, Route, Router, Routes, useNavigate } from "react-router-dom";
import HomeScreen from "./pages/home";
import LoginScreen from "./pages/login";
import AdmLoginScreen from "./pages/Adm/admLogin";
import AdmPainelScreen from "./pages/Adm/admPainel";
import AdmOverView from "./pages/Adm/PainelForm/admOverView";
import CharacterInfo from "./pages/characterInfo";



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" extat element={<Navigate to="/login" />} />
        <Route path="/home" extat element={<HomeScreen />} />
        <Route path="/character" extat element={<CharacterInfo />} />
        <Route path="/login" exat element={<LoginScreen />} />
        <Route path="/adm" element={<AdmLoginScreen />} />
        <Route path="/painel" extat element={<AdmPainelScreen />} />
        <Route path="/admOverView" extat element={<AdmOverView />} />
      </Routes>
    </div>
  );
}

export default App;
