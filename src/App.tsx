import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Header /> {/* Se mantiene fijo en todas las páginas */}
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer /> {/* Se mantiene fijo en todas las páginas */}
    </>
  );
}

export default App;
