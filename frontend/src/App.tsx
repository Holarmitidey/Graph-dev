import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Developers from './pages/Developers';
import DeveloperProfile from './pages/DeveloperProfile';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import GraphExplorer from './pages/GraphExplorer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/developers/:id" element={<DeveloperProfile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/graph" element={<GraphExplorer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;