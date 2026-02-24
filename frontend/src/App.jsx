import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/jobs" element={<Jobs />} />  
        <Route path="/profile" element={<Profile />} />    
      </Routes>
    </Router>
  );
}

export default App;