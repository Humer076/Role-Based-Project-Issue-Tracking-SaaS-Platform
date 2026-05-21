import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Home Page</h1></div>;
}

function About() {
  return <div className="p-8"><h1 className="text-2xl font-bold">About Page</h1></div>;
}

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="space-x-4 mb-4">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <Link to="/about" className="text-blue-600 hover:underline">About</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
