import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Home } from "./pages/Home";


function App() {
  return (
    <>
      <Header /> {/* Se mantiene fijo en todas las páginas */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer /> {/* Se mantiene fijo en todas las páginas */}
    </>
  );
}

export default App;
