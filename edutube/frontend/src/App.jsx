import { useState, useEffect } from "react";
import { NavLink, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import JourneyPage from "./pages/JourneyPage";
import ProfileDashboard from "./pages/ProfileDashboard";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import Cookies from "js-cookie";
import Auth from "./pages/Auth";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import Notes from "./pages/Notes";
import Chatbot from "./components/Chatbot";

function getPayload(jwt) {
  return JSON.parse(atob(jwt.split(".")[1]));
}


function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicRoute = ["/land", "/signup", "/auth"].includes(location.pathname);

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      const payload = getPayload(token);
      const expiration = new Date(payload.exp * 1000); 
      const now = new Date();

      if (expiration < now) {
        Cookies.remove("authToken"); 
        setIsAuthenticated(false);
        if (!isPublicRoute) navigate("/land");
      } else {
        setIsAuthenticated(true);
        setUser(payload);
      }
    } else {
      setIsAuthenticated(false);
      if (!isPublicRoute) navigate("/land");
    }
  }, [navigate, location.pathname, isPublicRoute]);

  return (
    <ThemeProvider>
      {location.pathname !== '/land' && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/journey/:jId" element={<JourneyPage />} />
        <Route path="/notes/:journeyId" element={<Notes />} />
        <Route path="/player/:chapterId" element={<VideoPlayerPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/land" element={<Landing />} />
      </Routes>
      {isAuthenticated && <Chatbot />}
    </ThemeProvider>
  );
}

export default App;
