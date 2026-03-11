import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ApplyJob from "./pages/ApplyJob";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/jobs" element={<Jobs />} />  
        <Route path="/profile" element={<Profile />} />    
        <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
        <Route path="/apply/:id" element={<ApplyJob />} />
      </Routes>
    </Router>
  );
}

export default App;