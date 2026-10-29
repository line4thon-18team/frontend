import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import TripCreatePage from './pages/TripCreatePage'
import TripPlanPage from './pages/TripPlanPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trips/new" element={<TripCreatePage />} />
        <Route path="/trips/plan" element={<TripPlanPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
