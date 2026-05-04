import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ turmas: 0, alunos: 0, professores: 0 });
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    async function carregar() {
      try {
        const [t, a, p] = await Promise.all([
          api.get('/turmas'),
          api.get('/alunos'),
          api.get('/professores'),
        ]);
        setStats({ turmas: t.data.length, alunos: a.data.length, professores: p.data.length });
      } catch {}
    }
    carregar();
  }, []);

  const cards = [
    { label: 'Turmas', valor: stats.turmas, cor: '#3b82f6', icone: '🏫' },
    { label: 'Alunos', valor: stats.alunos, cor: '#10b981', icone: '🎒' },
    { label: 'Professores', valor: stats.professores, cor: '#f59e0b', icone: '👨‍🏫' },
  ];

  return (
    <div>
      <h2 style={styles.titulo}>Bem-vindo, {usuario.nome}! 👋</h2>
      <p style={styles.sub}>Resumo geral do sistema</p>
      <div style={styles.grid}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...styles.card, borderTop: `4px solid ${c.cor}` }}>
            <span style={styles.icone}>{c.icone}</span>
            <div>
              <p style={styles.cardValor}>{c.valor}</p>
              <p style={styles.cardLabel}>{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  titulo: { margin: 0, color: '#1e3a5f', fontSize: 24 },
  sub: { color: '#6b7280', marginBottom: 32 },
  grid: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  card: { background: '#fff', borderRadius: 10, padding: 24, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', minWidth: 180 },
  icone: { fontSize: 36 },
  cardValor: { margin: 0, fontSize: 32, fontWeight: 'bold', color: '#111' },
  cardLabel: { margin: 0, fontSize: 14, color: '#6b7280' },
};
