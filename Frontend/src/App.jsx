import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
         </Routes>
      </Router>
   );
}

export default App;
