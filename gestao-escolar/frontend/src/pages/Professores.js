import React, { useEffect, useState } from 'react';
import api from '../services/api';

const VAZIO = { nome: '', cpf: '', email: '', formacao: '' };

export default function Professores() {
  const [professores, setProfessores] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const { data } = await api.get('/professores');
    setProfessores(data);
  }

  function abrirNovo() {
    setForm(VAZIO);
    setEditandoId(null);
    setMostrarForm(true);
    setErro('');
  }

  function abrirEditar(p) {
    setForm({ nome: p.nome, cpf: p.cpf, email: p.email, formacao: p.formacao || '' });
    setEditandoId(p.id);
    setMostrarForm(true);
    setErro('');
  }

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    try {
      if (editandoId) {
        await api.put(`/professores/${editandoId}`, form);
        setSucesso('Professor atualizado!');
      } else {
        await api.post('/professores', form);
        setSucesso('Professor cadastrado!');
      }
      setMostrarForm(false);
      carregar();
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar.');
    }
  }

  async function excluir(id) {
    if (!window.confirm('Excluir este professor?')) return;
    try {
      await api.delete(`/professores/${id}`);
      setSucesso('Professor excluído!');
      carregar();
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir.');
    }
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.titulo}>👨‍🏫 Professores</h2>
        <button style={styles.btnPrimario} onClick={abrirNovo}>+ Novo Professor</button>
      </div>

      {sucesso && <div style={styles.sucesso}>{sucesso}</div>}

      {mostrarForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitulo}>{editandoId ? 'Editar Professor' : 'Novo Professor'}</h3>
          {erro && <div style={styles.erro}>{erro}</div>}
          <form onSubmit={salvar} style={styles.form}>
            <Campo label="Nome Completo" required>
              <input style={styles.input} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
            </Campo>
            <Campo label="CPF" required>
              <input style={styles.input} value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00" required />
            </Campo>
            <Campo label="E-mail" required>
              <input style={styles.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </Campo>
            <Campo label="Formação">
              <input style={styles.input} value={form.formacao} onChange={e => setForm({ ...form, formacao: e.target.value })} placeholder="Ex: Licenciatura em Matemática" />
            </Campo>
            <div style={styles.formBotoes}>
              <button type="submit" style={styles.btnPrimario}>Salvar</button>
              <button type="button" style={styles.btnSecundario} onClick={() => setMostrarForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableWrapper}>
        <table style={styles.tabela}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>CPF</th>
              <th style={styles.th}>E-mail</th>
              <th style={styles.th}>Formação</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {professores.length === 0 && (
              <tr><td colSpan={5} style={styles.vazio}>Nenhum professor cadastrado.</td></tr>
            )}
            {professores.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={styles.td}>{p.nome}</td>
                <td style={styles.td}>{p.cpf}</td>
                <td style={styles.td}>{p.email}</td>
                <td style={styles.td}>{p.formacao || '—'}</td>
                <td style={styles.td}>
                  <button style={styles.btnEditar} onClick={() => abrirEditar(p)}>Editar</button>
                  <button style={styles.btnExcluir} onClick={() => excluir(p.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Campo({ label, children, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  titulo: { margin: 0, color: '#1e3a5f', fontSize: 22 },
  sucesso: { background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 14 },
  erro: { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 6, marginBottom: 12, fontSize: 14 },
  formCard: { background: '#fff', borderRadius: 10, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', maxWidth: 640 },
  formTitulo: { margin: '0 0 16px', color: '#1e3a5f' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  formBotoes: { gridColumn: '1 / -1', display: 'flex', gap: 10, marginTop: 8 },
  btnPrimario: { background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer', fontSize: 14 },
  btnSecundario: { background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer', fontSize: 14 },
  tableWrapper: { background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { background: '#1e3a5f' },
  th: { padding: '12px 16px', color: '#fff', textAlign: 'left', fontSize: 13, fontWeight: 600 },
  td: { padding: '11px 16px', fontSize: 14, color: '#374151', borderBottom: '1px solid #f1f5f9' },
  vazio: { padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 14 },
  btnEditar: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12, marginRight: 6 },
  btnExcluir: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 },
};
