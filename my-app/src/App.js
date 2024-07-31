import Login from './components/Login';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import './App.css';
import Interface from './components/Interface';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<div><Navbar /><Login /></div>}></Route>
        <Route path="/inter" element={<div><Interface /></div>}></Route>
      </Routes>
    </div>
    </Router>
  );
}
export default App;
