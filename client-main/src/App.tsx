import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VaultLanding from './pages/VaultLanding';
import BankService from './pages/BankService';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VaultLanding />} />
        <Route path="/bank-service" element={<BankService />} />
      </Routes>
    </Router>
  );
}

export default App;