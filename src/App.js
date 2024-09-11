import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/home";

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/checkout" element={<Checkout />} />
        <Route path="/card/:id" element={<ItemDetails />} /> */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
