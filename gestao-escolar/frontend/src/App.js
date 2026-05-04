import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Turmas from './pages/Turmas';
import Alunos from './pages/Alunos';
import Professores from './pages/Professores';
import Notas from './pages/Notas';
import Layout from './components/Layout';

function RotaPrivada({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <RotaPrivada>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/turmas" element={<Turmas />} />
                <Route path="/alunos" element={<Alunos />} />
                <Route path="/professores" element={<Professores />} />
                <Route path="/notas" element={<Notas />} />
              </Routes>
            </Layout>
          </RotaPrivada>
        } />
      </Routes>
    </BrowserRouter>
  );
}
