import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Units from './pages/Units';
import Timetable from './pages/Timetable';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PageNotFound from './pages/404';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>} >
          <Route index element={<Dashboard/>} />
          <Route path="/units" element={<Units/>} />
          <Route path="/timetable" element={<Timetable/>} />
          <Route path="/tasks" element={<Tasks/>} />
        </Route>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </Router>
  )
}