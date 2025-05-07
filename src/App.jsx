import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import CreateEvent from './components/CreateEvent'
import EventPage from './components/EventPage'
import ParticipantForm from './components/ParticipantForm'

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>調整さんクローン</h1>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/event/:eventId" element={<EventPage />} />
            <Route path="/event/:eventId/participate" element={<ParticipantForm />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© 2025 調整さんクローン</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
