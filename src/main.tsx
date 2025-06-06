
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Admin from './pages/Admin.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </Router>
);
