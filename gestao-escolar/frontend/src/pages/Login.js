import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('handleSubmit chamado');
    setErro('');
    setCarregando(true);
    try {
      const { data } = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fazer login.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>🎓 Gestão Escolar</h1>
        <p style={styles.subtitulo}>Acesse o sistema</p>
        {erro && <div style={styles.erro}>{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.campo}>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Senha</label>
            <input
              style={styles.input}
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          <button style={styles.botao} type="button" onClick={handleSubmit} disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={styles.dica}>
          Usuário padrão: <strong>admin@escola.com</strong> / senha: <strong>123456</strong>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' },
  card: { background: '#fff', borderRadius: 12, padding: 40, width: 360, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  titulo: { margin: 0, color: '#1e3a5f', textAlign: 'center', fontSize: 26 },
  subtitulo: { color: '#666', textAlign: 'center', marginBottom: 24 },
  erro: { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 14 },
  campo: { marginBottom: 16 },
  label: { display: 'block', marginBottom: 6, fontSize: 14, color: '#374151', fontWeight: 600 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' },
  botao: { width: '100%', padding: 12, background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, cursor: 'pointer', marginTop: 8 },
  dica: { fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 20 },
};