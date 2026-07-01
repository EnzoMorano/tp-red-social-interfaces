import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Home } from "./pages/Home";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import EditPost from "./pages/EditPost";
import Search from "./pages/Search";
import { ProtectedRoute } from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import { PublicRoute } from "./components/publicRoute";
import Privacy from "./pages/Privacidad";

function App() {
  return (
    <>
      <Header /> {/* Se mantiene fijo en todas las páginas */}
      <div className="pt-16">
        <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route path="/post/:id" element={<Post />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:nickname"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />

        <Route 
          path="/privacidad"
          element={<Privacy />}
        />
              </Routes>
      </div>
      <Footer /> {/* Se mantiene fijo en todas las páginas */}
    </>
  );
}

export default App;
