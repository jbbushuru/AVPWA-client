import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Units from './pages/Units';
import Timetable from './pages/Timetable';
import Tasks from './pages/Tasks';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout/>} >
          <Route index element={<Dashboard/>} />
          <Route path="/units" element={<Units/>} />
          <Route path="/timetable" element={<Timetable/>} />
          <Route path="/tasks" element={<Tasks/>} />
        </Route>
      </Routes>
    </Router>
  )
}