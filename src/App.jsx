import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Create from './pages/Create.jsx'
import Join from './pages/Join.jsx'
import Result from './pages/Result.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        {/* Magic link: /s/:sessionId → guest formu */}
        <Route path="/s/:sessionId" element={<Join />} />
        {/* Reveal: her iki taraf da bu ekranda real-time sonucu görür */}
        <Route path="/s/:sessionId/result" element={<Result />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
