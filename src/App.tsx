import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Home } from "./pages/Home";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost";


function App() {
  return (
    <>
      <Header /> {/* Se mantiene fijo en todas las páginas */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route path="/post/:id" element={<Post />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer /> {/* Se mantiene fijo en todas las páginas */}
    </>
  );
}

export default App;
