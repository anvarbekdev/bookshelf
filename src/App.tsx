import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Books from "./pages/Books";
import Myself from "./pages/MySelf";

function App() {
  return (
    <Router>
      <Routes>
        {/* Signup sahifasi */}
        <Route path="/signup" element={<Auth />} />

        {/* Books sahifasi */}
        <Route path="/books" element={<Books />} />

        {/* My Self sahifasi */}
        <Route path="/myself" element={<Myself />} />

        <Route path="/" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
