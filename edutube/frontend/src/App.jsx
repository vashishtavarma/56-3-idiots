import { useState, useEffect } from "react";
import { NavLink, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import JourneyPage from "./Pages/JourneyPage";
import ProfileDashboard from "./Pages/ProfileDashboard";
import VideoPlayerPage from "./Pages/VideoPlayerPage";
import Cookies from "js-cookie";
import Auth from "./Pages/Auth";
import SignUp from "./Pages/SignUp";
import Landing from "./Pages/Landing";
import Notes from "./Pages/Notes";
import Chatbot from "./Components/Chatbot";

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
      {location.pathname === '/land' && <Footer />}
      {isAuthenticated && <Chatbot />}
    </ThemeProvider>
  );
}

export default App;
