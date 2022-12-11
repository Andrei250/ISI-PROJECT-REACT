import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import BucharestMap from './components/Map/Map';
import Auth from "./pages/Auth/Auth";
import Loading from "./pages/loading/LoadingScreen";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Loading />} />
          <Route path="/app" element={<BucharestMap />}>
            <Route index element={<BucharestMap />} />
            {/* <Route path="blogs" element={<Blogs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
