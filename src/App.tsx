import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Foods from './pages/user/Foods';
import AdminFoods from './pages/admin/adminFoods';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/foods" element={<Foods />} />
        <Route path="/adminFoods" element={<AdminFoods />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
