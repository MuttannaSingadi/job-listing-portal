import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Home from "./Home";
import Admin from "./pages/Admin";
import Jobs from "./pages/Jobs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/jobs" element={<Jobs />} />      
      </Routes>
    </Router>
  );
}

export default App;