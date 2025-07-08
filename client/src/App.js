// App.js (with proper routing wrapper for useParams)
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Editor from './Editor';
import { v4 as uuidV4 } from 'uuid';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/docs/${uuidV4()}`} />} />
        <Route path="/docs/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
