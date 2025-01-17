
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReadExcel from './component/readExcel';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<ReadExcel />} />
      <Route path="/readExcel" element={<ReadExcel />} />
      </Routes>
    </Router>
  )
}

export default App
