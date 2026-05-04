import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  }

  const links = [
    { to: '/', label: '🏠 Dashboard' },
    { to: '/turmas', label: '🏫 Turmas' },
    { to: '/alunos', label: '🎒 Alunos' },
    { to: '/professores', label: '👨‍🏫 Professores' },
    { to: '/notas', label: '📝 Notas' },
  ];

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🎓 Gestão Escolar</div>
        <nav>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              style={({ isActive }) => ({
                ...styles.navLink,
                background: isActive ? '#2e5984' : 'transparent',
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div style={styles.usuarioInfo}>
          <p style={styles.usuarioNome}>{usuario.nome}</p>
          <p style={styles.usuarioPerfil}>{usuario.perfil}</p>
          <button style={styles.sairBtn} onClick={sair}>Sair</button>
        </div>
      </aside>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: 220, background: '#1e3a5f', color: '#fff', display: 'flex', flexDirection: 'column', padding: '20px 0' },
  logo: { fontSize: 16, fontWeight: 'bold', padding: '0 20px 20px', borderBottom: '1px solid #2e5984' },
  navLink: { display: 'block', padding: '12px 20px', color: '#cbd5e1', textDecoration: 'none', fontSize: 14, borderRadius: 4, margin: '2px 8px' },
  usuarioInfo: { marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid #2e5984' },
  usuarioNome: { margin: 0, fontSize: 13, fontWeight: 'bold', color: '#e2e8f0' },
  usuarioPerfil: { margin: '2px 0 10px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' },
  sairBtn: { background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', fontSize: 12 },
  main: { flex: 1, background: '#f8fafc', padding: 32, overflowY: 'auto' },
};
